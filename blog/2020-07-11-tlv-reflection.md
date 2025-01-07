---
slug: tlv-reflection
title: 'NDN API 1: Encoding'
authors: kinu
tags:
  - ndn
  - api
hide_table_of_contents: false
---

TL; DR: Reflection should be used for encoding or serilization.

<!-- truncate -->

## Forms of Existence

Every datum exist in two forms: a structured class used by the application, and an encoded wire used to transport.
The struct can be serialized to a buffer as wire; the wire can be parsed to an instance of the struct.
```go
// Code from https://github.com/go-ndn/ndn/
// Class Definition
type Data struct {
  Name           Name          `tlv:"7"`
  MetaInfo       MetaInfo      `tlv:"20"`
  Content        []byte        `tlv:"21"`
  SignatureInfo  SignatureInfo `tlv:"22"`
  SignatureValue []byte        `tlv:"23*"`
}

func main() {
  // Struct form
  data := &Data{Name: NewName("/hello")}

  // Wire's form (without TL of Data itself)
  wire := "\x07\x07\x08\x05hello"
}
```

Clearly, they are used in different scenarios.
- Wire is only used for transportation and storage.
  The program do not read or update any field of the wire form before it parses it into a struct.
- Struct is only used inside the program.
  It cannot be stored to the disk or even passed to another process.
  There are several reasons:
  - The size of the field is not fixed, like `int` can be either 32 or 64 bits.
  - It is a waste of space.
  - An updated version may contain more fields that an old program cannot recognize.

Since they are totally two different things, they shouldn't be combined into a single class, by *Single Responsibility*.

In the following text, I will use "message" or "datum" if there is no need to distinguish the form.
"wire" and "struct" are used otherwise.
Also, Capitalized term Type, Length and Value means TLV variables.
I will use type, size and content for general meaning.


## Encoding

Since the size of a wire is flexible, there are 3 ways of encoding:
1. Allocate a large enough buffer -> encode -> truncate
2. Calculate the size of each field -> allocate a buffer of exact that size -> encode
3. Ask users to provide the buffer. They can call a function to calculate the size if they want.

Traditional libraries use 3. For example, in WinAPI, `WideCharToMultiByte` and `GetWindowText`.
In C++ std, `sprintf`.
However, this kind of API is very unfriendly and does not have much sense if there is a GC.

1 and 2 are used by current NDN library, such as [ndn-cxx](https://github.com/named-data/ndn-cxx),
[ndn-cpp](https://github.com/named-data/ndn-cpp) and [go-ndn](https://github.com/go-ndn/tlv).
ndn-cxx mainly uses 2, but due to the Signature problem, 1 is used for Data packets.
The details can be found in [this note](https://redmine.named-data.net/issues/4866#note-1). (Thank Junxiao for the link)
I think the benefits include the following:
- It is easy to write the code.
  There is only one pass. Just prepend elements into the wire.
  Variable length does not make the problem harder here.
- Since the application does not make use of the wire,
  it will be written into a disk or shot to the network and then freed.
  The overhead can be ignored.

But NDN applications sometimes need to store packets in memory, which leads to a problem.
In NDN, most Data packets are signed.
Thus, the producer application, such as a file server, may want to segment and sign all files after it starts up,
and then cache those packet in memory.
Intuitively, this will save some calculation power and reduce the latency.
However, this may lead to a huge waste of memory.
As every Data, no matter how small it is, takes the size of the buffer reserved before encoding.
The default value of this reserved buffer size is set to be the maximum MTU (8800B).
(Code can be found [here](https://github.com/named-data/ndn-cxx/blob/fe24bf84129d71569d13af918a394ccc9c56a999/ndn-cxx/security/key-chain.cpp#L454-L455), which calls [this constructor](https://github.com/named-data/ndn-cxx/blob/2c1d349bdb9a1f7b2a0b07ea11e6f24650bde6cd/ndn-cxx/encoding/encoding-buffer.hpp#L40-L43) with default buffer size)
This waste of memory is observed in [ndnputchunks](https://github.com/named-data/ndn-tools) and
[NFD](https://github.com/named-data/NFD).

Note: This only happens when one tries to sign the packet. Encoding a Data without signature does not waste any memory.
Thank Professor Alex Afanasyev for pointing this out.

Therefore, [python-ndn](https://github.com/zjkmxy/python-ndn) chooses 2.
The encoding procedure has 3 phases:
- Calculating size: iterate fields to collect their size and allocate buffer.
- Filling in data: iterate fields again and fill their values into allocated buffer.
- Final adjustment: adjust the result for signature. Will talk about it later.

### Related work

Recently I looked into some other serialization libraries.
I should have read good libraries before I design `python-ndn`, but I didn't, just like those `ndn-cxx` designers.
**"It's much easier to write wrong code than read correct code."**
But we should read related code works, just as doing research.

- `protobuf-go` basically uses method 2, shown in [this line](https://github.com/protocolbuffers/protobuf-go/blob/e14d6b3cdce27a8743907161e84fa6d07e30266d/proto/encode.go#L153)
- `encoding/json` in Go uses method 1, but it starts from an empty slice and keeps appending (self-adjusting),
  instead of allocating maximum size.
  But generally people do not care performance that much when they choose json.
- In C#, `BinaryFormatter` uses `MemoryStream`, which is also a self-adjusting data structure.
  However, when we call `ToArray` to get the result, it makes a copy that has no extra bytes.

## Procedural Variables

One thing makes `python-ndn` different from all work above is it has 3 phases.
After we calculated the size of every field at phase 1, we don't want to redo it at phase 2.
Because the "Length" in TLV also has a variant size, it is not feasible for a nested struct to
leave the length blank and process it children first.
Thus, we have to remember all the sizes during the encoding procedure.

One mistake `ndn-cxx` made is keeping these variables even after encoding (or decoding).
This leads to a waste of space.
- Applications seldom look at those fields. They only care real data.
- TLV structs are still low level objects, so applications seldom modify it:
  even when only a single field changes, if it's done by higher level,
  the application will encode another object.
  An exception is forwarder. Will be covered later.
- What makes it really horrible is that `ndn-cxx` stores not only the sizes, but also a `shared_ptr` to nearly everything:
  beginning of a field, value part of a field, etc.
  On a 64-bit Mac OS, a `shared_ptr` takes 48B.
  Which adds to an overhead of 1KB for every Interest, even it can be encoded into 10B.

There are more procedural varaibles if we consider the signature.
The hash of the parts covered by the signature is also a procedural varaible.
To calculate this, we may need some pointer pointing to the start and the end of covered parts, which are also procedural varaibles.
They need to be passed among phases, but become useless after encoding (or decoding).

In `python-ndn`, the encoding function creates a map to store these procedural variables.
Every field can put whatever they want into this map.
The map is freed before the function returns.
If we want more efficiency and use a lower-level language, like C or Go,
we can ask each field to declare the number of bytes needed by its procedural variables,
and replace the map with a byte array.

## Reflection & Flexibility

> "There are two ways of constructing a software design.
> One way is to make it so simple that there are obviously no deficiencies.
> And the other way is to make it so complicated that there are no obvious deficiencies." - C.A.R Hoare

I don't intend to offense anyone, but when people don't understand Object-Oriented Programming or design patterns,
dogmatic usage of them usually leads to over complicated solution.
The designers of `ndn-cxx` pursue abstraction and flexibility by a pure OO way, but it does not work very well.

The problem is that in C++, the base class has no info about the derived class.
Thus, we cannot just write an `encode` function in a `Message` class, and let it work for all concrete messages.
If every subclass, e.g. `Data`, must implement its own `encode` and `decode` function,
what's the meaning of giving them a shared base class?
Also, the code looks very redundant. Let's use Go pseudo code for example:

```go
type Data struct {
  // Definition is a copy of the spec
  Name           Name
  MetaInfo       MetaInfo
  Content        Block
  SignatureInfo  SignatureInfo
  SignatureValue Block
}

func (d *Data) Encode() (buf []byte, err error) {
  buf = make([]byte, MaxSize)
  ptr := MaxSize
  // Repeat the definition
  ptr = d.Name.prepend(0x07, buf, ptr)
  ptr = d.MetaInfo.prepend(0x20, buf, ptr)
  // ...
}

func (d *Data) Decode(buf []byte) (err error) {
  ptr := buf
  // Repeat again
  for len(ptr) > 0 {
    t, l, v, ptr := parseTlv(ptr)
    switch t {
    case 0x07:
      d.Name.Decode(v)
    case 0x20:
      d.MetaInfo.Decode(v)
    // ...
    }
  }
}
```

This design results in 70000 lines of code.
We suffered a lot when we want to change the spec, like adding ApplicationParameters to Interest.
This experience shows clearly that this design is not extensible and not flexible as supposed to be.

The problem can be solved easily by reflection.
As shown in the first section,
we only need to translate the spec into a struct definition with some annotations,
and the universal encode/decode function will automatically handle the new struct.

```go
// Code from https://github.com/go-ndn/tlv/
func writeTLV(b []byte, t uint64, value reflect.Value, noSignature bool) (n int, err error) {
  // ... Omit: Write T and L
  switch value.Kind() {
  case reflect.Bool:
    if value.Bool() {
      n += writeVarNum(b[n:], t)
      b[n] = 0
      n++
    }
  case reflect.Uint64:
    n += writeVarNum(b[n:], t)
    n += writeUint64(b[n:], value.Uint())
  case reflect.Slice:
    // ... Omit: Repeated field
  case reflect.String:
    n += writeVarNum(b[n:], t)
    v := value.String()
    n += writeVarNum(b[n:], uint64(len(v)))
    n += copy(b[n:], v)
  case reflect.Ptr:
    // Optional Field
    return writeTLV(b[n:], t, value.Elem(), noSignature)
  case reflect.Struct:
    // ... Omit: Nested struct
  default:
    err = ErrNotSupported
  }
  return
}
```

### Related work

- `go-ndn` uses reflection: [The design of go-ndn](https://medium.com/@tailinchu/the-design-of-go-ndn-d5e7b3d6e0ae)
- In Go `encoding/json` uses reflection.
- Protobuf is different: it uses a language defined by itself and generates target codes.
  However, `protobuf-go` also uses reflection.
  For other languages, I'm not sure.
  But what I'm sure is that generated code contains reflection info.
- C# Entity Framework uses reflection to support ORM.
- Similarly does Django in Python.
- NS3 uses reflection for setting up and logging.

## Signature

Signature is tricky
- It adds new types of procedural variables: pointers to parts covered by signature and hash of it.
- ECDSA signature has a flexible size, so we cannot get accurate length in phase 1.
- There is no related work that handles it.
- Keys are needed to sign or verify the signature, which seems not related to encoding.
- Not every packet is signed.
- In some *rare* case, the application needs to fetch a certificate from the network.


However, I still think that we should combine signing with encoding.
- In NDN every packet should be signed. Thus, the application needs to sign nearly every time after encoding.
- We cannot write down the length of the whole packet without signing it.
- The hash of the covered part can be easily computed during encoding, and is only useful to signing.
  We don't want the encoding function to return it every time since the app developer does not care it at all.
  But we do need this for signing.

The solution in `python-ndn` is require the application to provide a signer interface,
which contains the key and algorithm for signing.
Here are the details how it works:
- Unlike `go-ndn`, in `python-ndn`, fields are not primitive types, but properties.
  Therefore, how a field is encoded can be different from how it "looks like".
- There are some special fields called `markers`.
  They don't hold any value and will not occur in the result.
  Instead, they record the offsets in the wire when we meet them.
- The user needs to input a `Signer` when he calls the encoding function.
- In phase 1 (calculating size), `SignatureValue` gives upperbound size, as we don't know the exact size now.
- In phase 2 (filling in data), a marker called `_sig_cover_start` records the first field covered by the signature.
  `SignatureValue` uses this marker to compute the hash and sign the message.
- In phase 3 (final adjustment), `SignatureValue` reports that the actual encoded size to the encoding function.
  Then, the encoding function adjust the Length of the packet and creates a memoryview to the real wire, which is part of the buffer.

`SignatureValue` must be at the top level of a struct, because otherwise a chained modification of Length may ruin the whole buffer.
This is because the length of Length may also become shorter.
If it's at the top level, the worst case is we adjust the TL part of the struct and then cut the head and the tail.
```text
Assume that the "planned" length is 0x100000000, where the upperbound size of SignatureValue is 32B
+----+----------------------------+-~~~-+----+----+----------------+
| 06 | FF 00 00 00 01 00 00 00 00 | ... | 17 | 20 | 00 00 .. 00 00 |
+----+----------------------------+-~~~-+----+----+----------------+
 Type     "Planned" Length                ^ SignatureValue

If the SignatureValue says it only uses 32B, we adjust the buffer as follows
+-------------+----+----------------+-~~~-+----+----+-------------+----+
| 06 FF 00 00 | 06 | FE FF FF FF FF | ... | 17 | 1F | AA BB .. FF | 00 |
+-------------+----+----------------+-~~~-+----+----+-------------+----+
              \                                                   /
               ------------------------v--------------------------
                     This is the real wire we need to return
We need to modify 7 bytes and waste 5 bytes. Not bad.
```

Verification after decoding is more tricky. I didn't handle it well in `python-ndn`.
- The application *usually* needs to fetch the certificate from the network.
- The worse news is that sometimes the application needs to get the certificate from the content or somewhere else.
  So we have no idea how to fetch the certificate.
- Obviously, we cannot ask the app developer to provide the certificate in the decoding function as we do for signing.
- Most developer don't think decoding is a time consuming task.
  Thus, it's counterintuitive if our encoding function is a normal function but decoding function is a coroutine.

I can come up with these ways
- Provide two versions: w/ verify and w/o verify.
  - w/ verify version is a coroutine and requires the user to give a *validator* interface.
- Return a validating info that can be used for validation later.

Unfortunately, `python-ndn` gives a really bad example this time:
I thought the application may only need the content of Data and I wanted to force the application to validate every packet.
Therefore, I required users to give a validator when expressing the Interest,
and discards SignatureInfo and SignatureValue after the function returns.

This does not work well for security bootstrapping:
- The application may need the Name of the signer for further use.
- There can be user-defined fields in the packet.
  - I don't think it is a good design to modify the Data struct,
    but this is the current practice of ndn-cxx Certificate.

The lesson is that we should never discard any field without thinking.
Then, what about unknown fields in decoding?

## Pointers to Blocks V.S. Raw Packet

When decoding a packet, `ndn-cxx` keeps pointers to all unknown fields, in `ndn::Block::elements`.
This works but in a clumsy way.

Consider the question that for a specific version of application (forwarder excluded), "does it understand a field":
- If the answer is **yes**
  - The application is written up to date with the spec.
  - Therefore, we may believe that the definitions of all structs are also up to date.
  - Thus, there does not exist "unknown fields" in this copy of application.
- If the answer is **no**
  - Well, the application is running on an old version and there may be some unknown fields for sure.
  - But since the application does not understand those fields at all, even we keep them,
    what can the application do to this field?

Hence, my answer is that, instead of keeping those unknown fields after decoding,
we should let the application be able to access the raw packet.
Then, the application can use the latest spec it understands to decode the packet.

## About Name

Name is special in NDN world, so it's worth giving a special type of field, rather than using the following protobuf code:
```protobuf
// Code comes from PyNDN2
message Name {
  repeated bytes component = 8;
}

message FibEntry {
  required Name name = 7;
  // ...
}
```

I can come up with 3 ways to handle Name:
1. Write a class for `Name` and `Component`, like `ndn-cxx` does.
  `go-ndn` can be considered as a variant of this.
2. Use `bytes` directly.
3. Define `Name` to be a list of Component but use `bytes` directly for Component.
  `python-ndn` uses this way. The protobuf file given above is similar.

I prefer 3 because we can reuse most operations defined by `bytes` for Component.
- The [Canonical Order](https://named-data.net/doc/NDN-packet-spec/current/name.html#canonical-order) of Component is exactly
  the lexicographical order of `bytes`.
- Memory copy works for Component.
- The Type of a Component is generally the first byte. We can write a function to handle multi-byte cases.
- I don't think developers will modify existing Components. They will create new Components instead.
  Just like how people handle short strings.
- Generally developers do not care the Length of a Component.
  If they want to do something to the Value, they will take it out.

## Languages Support

Though different languages has different features, reflection can be achieved by most languages.

### Python

See [python-ndn](https://github.com/zjkmxy/python-ndn).

### Go

Go does not support properties, or more accurately, *data descriptors*.
However, most field types are primitive types.
Exceptions are Name, SignatureValue and OffsetMarkers.
Those can be done by struct tags.

### C++

C++ does not support reflection at the language level, but we can do it ourselves, like what NS3 does.
Also, a code generator like protobuf also works.

### C#

There are so many choices for C#: dynamic reflection, source generator, emit, ...
The concern becomes which one to pick rather than how to implement.

### Java

Custom annotations.
Java does not have language level coroutine, but this does not affect encoding too much.

## Forwarder & In-place Update

Forwarder behaves differently from other applications:
- Applications understand and produce data; forwarders do not understand most packets.
- Applications generally creates a new packet if it modifies something;
  Forwarders only need to modify very few fields, and cannot recreate a packet.

Currently the only field a forwarder needs to change is `HopLimit`, which is of fixed size.
Therefore, a better strategy for forwarder is to do everything **in place**.
That is, instead of decoding the wire to a struct, the forwarder only decodes the fields it cares,
and get a pointer to each one.
When the forwarder modifies `HopLimit`, it changes the number in the wire directly.
Then, the forwarder does not need to encode any packets.
When a packet is forwarded, the original memory buffer is sent out.

## Meta of Meta

Sometimes the application wants a machine-readable spec.
- A distributed app requires different versions to work together.
  Therefore, an old version needs to properly store and handle data generated by a newer version.
  It may be helpful if the newer version can explain the latest spec to the older version.
- A platform application or a plugin-based application may want to support user defined resources.
  For example, Kubernetes supports CRD (custom resource definition).
  Different from repo, Kubernetes has management tools for all resources,
  which are supposed to output the details of a resource even it is defined by the user.

Current NDN Spec uses EBNF, which is perfect for human readers, but not friendly to programs.
A format looking like protobuf definition or DotNET XAML may be helpful.
Then, if we want to use TLV to encode this spec, we need to have a spec for how to define specs in TLV.
This becomes a meta definition of a meta definition of packets.

Though meta of meta may look like a corner case, sometimes it's really painful.
For example, Kubernetes users are complaining that CRD does not have protobuf support like native resources do.

I haven't thought through this deeply, but I can provide a first draft for reference.
```protobuf
// A user defined annotation
message Annotation {
  string name = 100;
  bytes value = 101;
}

// A field in a message
message Field {
  enum FieldType {
    UNKNOWN = 0;
    BOOL = 1;
    UINT = 2;
    NAME = 3;
    BYTES = 4;
    REPEATED = 5;
    NESTED = 6;
    // Signature and Interest Digest Name are not supported
  }

  string name = 200;
  FieldType type = 201;
  uint32 tlv_type = 202;
  // The underlying type of a repeated field
  FieldType repeated_subtype = 203;
  // The underlying type of a nested model field
  // Here we need a submodel to make Type of Name be 7.
  message NestedModel {
    Name name = 7;
  }
  NestedModel nested_model = 204;
  // User defined annotations
  repeated Annotation annotations = 102;
}

message Model {
  // The last component should be version
  Name name = 7;
  repeated Field fields = 205;
  repeated Annotation annotations = 102;
}

message Spec {
  // The last component should be version
  Name name = 7;
  repeated Model models = 206;
}
```
