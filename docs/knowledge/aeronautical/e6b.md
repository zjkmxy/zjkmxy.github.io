# How to use E6B

Mechanical E6B
--------------

### Structure

- Slide rule for mathematics and conversions
  - 10 on outer scale as *Math Pointer*
  - 60 on the inner scale as *Rate Pointer*
- Sectional plotter and chart on the front
- Wind correction angle for backside

### Math

- Multiplication 5x7:
  - Line inner 50 with outer 10
  - Find outer 70
  - Read the number 35 inner (=35)
- Multiplication 17*53:
  - Line inner 17 with outer 10
  - Find outer 53
  - Read the number 90 inner (=900)

### Conversion

- Convert 100 nm to sm
  - Find NAUT & STAT on the outer scale (left of 70)
  - Line 10 on the inner scale with NAUT
  - Read the answer under the STAT (11.5 = 115 sm)
- Convert 53 GAL to LBS
  - Find US GAL & FUEL LBS
  - Line up 53 with US GAL
  - Read the answer under FUEL LBS (32 = 320 lbs)
- Density altitude 30C 1000ft (pressure alt)
  - On the right align +30C (left of 0C) with 1 (= 1000ft)
  - Read DENSITY ALTITUDE above (3 = 3000ft)
- True Airspeed with 0C 10000ft (pressure alt) 160kts (CAS)
  - On the right align 0C with 10 (= 10000 ft)
  - Find 16 (= 160kts) on the inner scale
  - Read the answer on the outer scale (18.8 = 188kts)

### Wind, Time, Fuel

- Wind Correction with True Course 360, TAS 130 kts, Wind 270 at 30 kts
  - Align Wind direction (270) with True Index.
  - Slide to one horizontal line. Draw a line up to mark the wind speed (30).
  - Rotate to align the True course (370) with True Index.
  - Slide the marked dot to TAS (130)
  - Ground Speed is under the grommet (127)
  - Wind Correction Angle is the line to the marked dot (13 left)
    - True heading will be 347.
- Time En Route with dist 250nm, GS 127 kts
  - Line Time pointer 60 to 12.7
  - Locate the dist 25 on the outer scale
  - Read the result in the inner scale (1hr 58 min)
- Fuel with rate 12.5Gal/hr
  - Line back Time pointer with the fuel burn rate (12.5)
  - Find the time en route (1hr 58min)
  - Read the result from outer scale (24.6 Gal).

Navigation
----------

- Heading formula: TC + WCA -> TH + V -> MH + D -> CH
- VOR: VHF Omnidirectional Range
  - Compass ring on charts around a VOR station uses *magnetic* north (same as runway number).
  - On a VOR, the circle is the plane having the course direction, and the niddle gives the position of the course.
    - Niddle is left means left of course. Left/Right only makes sense when the plane is towards the course direction.
    - Each dot represents 2deg. Actual distance off course depending on the distance to the station.
- Magnetic Course:
  - East is least, west is best.
    - That is, variation of xxE is substracted from the true course to get magnetic course. xxW is added.

Weight and Balance
------------------
- 1 US Gal fuel is 6 lbs.

Extra: Why E6B Works
--------------------

### Math part
- Consider a straight, additive slide rule. Suppose $a_1,a_2$ on Scale A is aligned with $b_1,b_2$ on Scale B.
  - Then we have $ a_2 - a_1 = b_2 - b_1 $
- Now suppose the scale is marked by logarithm. That is, number = e ^ length.
  - Then we have ratio equation $ a_2 / a_1 = b_2 / b_1 $
- Then, we make it circular, and make sure that one cycle is 10 times. That is, the starting mark 10 becomes 100 after one round. Thus, number $x$ is written at the angle $360^{\circ}\times(\lg x - 1)$, for $10\le x< 100$.
  - The ratio equation holds no matter whether the start point is 1 or 10. So we get the two main scales.
- The time scale is marked by considering the scale as 10min and casting it to hours. 60 min is 1 hour.
  - Even when using the time scale for hours reading, the inner scale can still be used to get the minute number.
    - For example, 4:00 is 24*(10min). The next short mark means 24.2 in the inner scale, thus 4:02.

### Convertion Part
- Altimeter setting to altitude is about 970 per "Hg (inches Hg).
  - Estimate: PressureAlt = (29.92 - Altimeter) x 970 + Elevation
- However, the relation between temperature and altitude is linear.
  - The standard setting is 15C at sea level with 29.92 "Hg.
    Thus, when the scales are reset (10 aligned with 10), pressure alt has a setting of 0 aligned with 15.
  - The temprature decreases 2C or 3.5F per 1000 feet (not corrected for pressure).
    This is how the left temprature scale is designed.
    - Note that the **spread** of temperature and dew point is 2.5C or 4.4F per 1000 feet.
  - The temperature correction is about 120 feet per C. That's how the right scales are designed.

### Wind Part
- Basically cosine theorem.
- The wind blows from the end of wind mark to the grommet.
  Thus, when the TAS is from 0 to the wind mark, the GS is from 0 to the grommet.
