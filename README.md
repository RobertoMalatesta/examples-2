# Examples

### Basket Losses

```
GLHP Expected 10-Yr Losses:
29.6265
Gaussian Binomial Expected 10-Yr Losses:
25.8297
T Binomial Expected 10-Yr Losses:
25.6508
G Inhomogeneous Expected 10-Yr Losses:
26.111
Random G Expected 10-Yr Losses:
26.1135
Random T Expected 10-Yr Losses:
28.2459
Random Loss G Expected 10-Yr Losses:
24.058
Random Loss T Expected 10-Yr Losses:
23.6476
Base Correlation GLHP Expected 10-Yr Losses:
29.6265
Run completed in 1 m 25 s
```

### Bermudan Swaption

```
G2 (analytic formulae) calibration
1x5: model 10.04549 %, market 11.48000 % (-1.43451 %)
2x4: model 10.51234 %, market 11.08000 % (-0.56766 %)
3x3: model 10.70500 %, market 10.70000 % (+0.00500 %)
4x2: model 10.83817 %, market 10.21000 % (+0.62817 %)
5x1: model 10.94387 %, market 10.00000 % (+0.94387 %)
calibrated to:
a     = 0.050053, sigma = 0.0094424
b     = 0.05005, eta   = 0.0094424
rho   = -0.76301

Hull-White (analytic formulae) calibration
1x5: model 10.62037 %, market 11.48000 % (-0.85963 %)
2x4: model 10.62959 %, market 11.08000 % (-0.45041 %)
3x3: model 10.63414 %, market 10.70000 % (-0.06586 %)
4x2: model 10.64428 %, market 10.21000 % (+0.43428 %)
5x1: model 10.66132 %, market 10.00000 % (+0.66132 %)
calibrated to:
a = 0.046414, sigma = 0.0058693

Hull-White (numerical) calibration
1x5: model 10.31185 %, market 11.48000 % (-1.16815 %)
2x4: model 10.54619 %, market 11.08000 % (-0.53381 %)
3x3: model 10.66914 %, market 10.70000 % (-0.03086 %)
4x2: model 10.74020 %, market 10.21000 % (+0.53020 %)
5x1: model 10.79725 %, market 10.00000 % (+0.79725 %)
calibrated to:
a = 0.055229, sigma = 0.0061063

Black-Karasinski (numerical) calibration
1x5: model 10.32593 %, market 11.48000 % (-1.15407 %)
2x4: model 10.56575 %, market 11.08000 % (-0.51425 %)
3x3: model 10.67858 %, market 10.70000 % (-0.02142 %)
4x2: model 10.73678 %, market 10.21000 % (+0.52678 %)
5x1: model 10.77792 %, market 10.00000 % (+0.77792 %)
calibrated to:
a = 0.043389, sigma = 0.12075

Payer bermudan swaption struck at 5.00000 % (ATM)
G2 (tree):      14.11
G2 (fdm) :      14.112
HW (tree):      12.904
HW (fdm) :      12.91
HW (num, tree): 13.158
HW (num, fdm) : 13.157
BK:             13.002
Payer bermudan swaption struck at 6.00000 % (OTM)
G2 (tree):       3.194
G2 (fdm) :       3.1808
HW (tree):       2.4921
HW (fdm) :       2.4596
HW (num, tree):  2.615
HW (num, fdm):   2.5829
BK:              3.2751
Payer bermudan swaption struck at 4.00000 % (ITM)
G2 (tree):       42.609
G2 (fdm) :       42.705
HW (tree):       42.253
HW (fdm) :       42.215
HW (num, tree):  42.364
HW (num, fdm) :  42.311
BK:              41.825

Run completed in 5 m 31 s
```

### Bonds

```
Today: Monday, September 15th, 2008
Settlement date: Thursday, September 18th, 2008

                          ZC     Fixed  Floating
------------------------------------------------
 Net present value    100.92    107.67    102.36
       Clean price    100.92    106.13    101.80
       Dirty price    100.92    107.67    102.36
    Accrued coupon      0.00      1.54      0.56
   Previous coupon       N/A    4.50 %    2.89 %
       Next coupon       N/A    4.50 %    3.43 %
             Yield    3.00 %    3.65 %    2.20 %

Sample indirect computations (for the floating rate bond):
------------------------------------------------
Yield to Clean Price: 101.80
Clean Price to Yield: 2.20 %

Run completed in 1 s
```

### Callable bonds

```
Pricing a callable fixed rate bond using
Hull White model w/ reversion parameter = 0.03
BAC4.65 09/15/12  ISIN: US06060WBJ36
roughly five year tenor, quarterly coupon and call dates
reference date is : October 16th, 2007

sigma/vol (%) = 0.00
QuantLib price/yld (%)  96.47 / 5.48
Bloomberg price/yld (%) 96.50 / 5.47

sigma/vol (%) = 1.00
QuantLib price/yld (%)  95.64 / 5.67
Bloomberg price/yld (%) 95.68 / 5.66

sigma/vol (%) = 3.00
QuantLib price/yld (%)  92.31 / 6.49
Bloomberg price/yld (%) 92.34 / 6.49

sigma/vol (%) = 6.00
QuantLib price/yld (%)  87.08 / 7.85
Bloomberg price/yld (%) 87.16 / 7.83

sigma/vol (%) = 12.00
QuantLib price/yld (%)  77.34 / 10.64
Bloomberg price/yld (%) 77.31 / 10.65


Run completed in 1. s
```

### CDS

```
***** Running example #1 *****

Calibrated hazard rate values:
hazard rate on May 15th, 2007 is 0.0299689
hazard rate on September 20th, 2007 is 0.0299689
hazard rate on December 20th, 2007 is 0.0299613
hazard rate on June 20th, 2008 is 0.0299619
hazard rate on June 22nd, 2009 is 0.0299607

Some survival probability values:
1Y survival probability: 97.040061 %
               expected: 97.040000 %
2Y survival probability: 94.175780 %
               expected: 94.180000 %


Repricing of quoted CDSs employed for calibration:
3M fair spread: 1.500000 %
   NPV:         -7.18501e-11
   default leg: -5218.16
   coupon leg:  5218.16

6M fair spread: 1.500000 %
   NPV:         -1.52795e-10
   default leg: -8882.83
   coupon leg:  8882.83

1Y fair spread: 1.500000 %
   NPV:         -2.05728e-09
   default leg: -16142.9
   coupon leg:  16142.9

2Y fair spread: 1.500000 %
   NPV:         -6.25732e-10
   default leg: -30195.6
   coupon leg:  30195.6



Run completed in 0 s
***** Running example #2 *****
September 22nd, 2014
December 22nd, 2014
March 20th, 2015
June 22nd, 2015
September 21st, 2015
December 21st, 2015
March 21st, 2016
June 20th, 2016
September 20th, 2016
December 20th, 2016
ISDA rate curve:
November 24th, 2014     0.000061        0.999994
December 23rd, 2014     0.000444        0.999923
January 23rd, 2015      0.000805        0.999793
April 23rd, 2015        0.001845        0.999070
July 23rd, 2015 0.002575        0.998062
October 23rd, 2015      0.003393        0.996594
October 24th, 2016      0.002217        0.995551
October 23rd, 2017      0.002749        0.991764
October 23rd, 2018      0.003521        0.985986
October 23rd, 2019      0.004516        0.977637
October 23rd, 2020      0.005725        0.966173
October 25th, 2021      0.007076        0.951562
October 24th, 2022      0.008480        0.934305
October 23rd, 2023      0.009823        0.915290
October 23rd, 2024      0.011050        0.895248
October 23rd, 2026      0.013130        0.854070
October 23rd, 2029      0.015384        0.793724
October 23rd, 2034      0.017604        0.702988
October 24th, 2044      0.018849        0.567776
first period = September 22nd, 2014 to December 22nd, 2014 accrued amount = 8888
8.888889
reference trade NPV = -43769.625488
ISDA credit curve:
June 21st, 2019;0.051655;0.948345;0.011361
***** Running example #3 *****
ISDA yield curve:
date;time;zeroyield
July 15th, 2011;0.087671;0.004511
August 15th, 2011;0.172603;0.009452
September 15th, 2011;0.257534;0.012322
December 15th, 2011;0.506849;0.017781
March 15th, 2012;0.756164;0.019367
June 15th, 2012;1.008219;0.020820
June 17th, 2013;2.013699;0.016293
June 16th, 2014;3.010959;0.019975
June 15th, 2015;4.008219;0.022863
June 15th, 2016;5.010959;0.025119
June 15th, 2017;6.010959;0.026883
June 15th, 2018;7.010959;0.028224
June 17th, 2019;8.016438;0.029336
June 15th, 2020;9.013699;0.030236
June 15th, 2021;10.013699;0.031038
June 15th, 2022;11.013699;0.031776
June 15th, 2023;12.013699;0.032565
June 15th, 2026;15.016438;0.034070
June 16th, 2031;20.021918;0.034506
June 16th, 2036;25.027397;0.034206
June 17th, 2041;30.032877;0.034108
ISDA credit curve:
date;time;survivalprob
December 21st, 2011;0.523288;0.993032
June 21st, 2012;1.024658;0.986405
June 21st, 2014;3.024658;0.939078
June 21st, 2016;5.027397;0.862452
June 21st, 2018;7.027397;0.788519
June 22nd, 2021;10.032877;0.690297
```

### Convertable bonds

```
option type = Put
Time to maturity = 5.00548
Underlying price = 36
Risk-free interest rate = 6.000000 %
Dividend yield = 2.000000 %
Volatility = 20.000000 %


===============================================================
Tsiveriotis-Fernandes method
===============================================================
Tree type                          European      American
---------------------------------------------------------------
Jarrow-Rudd                        105.690610    108.160895
Cox-Ross-Rubinstein                105.698303    108.154477
Additive equiprobabilities         105.626150    108.104772
Trigeorgis                         105.698806    108.154914
Tian                               105.712595    108.164054
Leisen-Reimer                      105.668164    108.168380
Joshi                              105.668165    108.168381
===============================================================

Run completed in 15 s
```

### CVAIRS

```
-- Correction in the contract fix rate in bp --
   5   | 3.249 %   |  -0.24 |  -0.87 |  -2.10
  10   | 4.074 %   |  -2.15 |  -5.62 | -11.65
  15   | 4.463 %   |  -4.60 | -10.41 | -19.60
  20   | 4.675 %   |  -6.94 | -14.57 | -25.67
  25   | 4.775 %   |  -8.79 | -17.63 | -29.62
  30   | 4.811 %   | -10.16 | -19.73 | -32.00

Run completed in 2 m 34 s
```

### Discrete hedging

```
Option value: 2.51207

         |          |      P&L |      P&L | Derman&Kamal |      P&L |      P&L
 samples |   trades |     mean | std.dev. |      formula | skewness | kurtosis
------------------------------------------------------------------------------
   50000 |       21 |    0.001 |     0.43 |         0.44 |    -0.29 |     1.45
   50000 |       84 |    0.001 |     0.22 |         0.22 |    -0.18 |     1.83

Run completed in 2 m 14 s
```

### Equity Option

```
Option type = Put
Maturity = May 17th, 1999
Underlying price = 36
Strike = 40
Risk-free interest rate = 6.000000 %
Dividend yield = 0.000000 %
Volatility = 20.000000 %


Method                             European      Bermudan      American
Black-Scholes                      3.844308      N/A           N/A
Heston semi-analytic               3.844306      N/A           N/A
Bates semi-analytic                3.844306      N/A           N/A
Barone-Adesi/Whaley                N/A           N/A           4.459628
Bjerksund/Stensland                N/A           N/A           4.453064
Integral                           3.844309      N/A           N/A
Finite differences                 3.844342      4.360807      4.486118
Binomial Jarrow-Rudd               3.844132      4.361174      4.486552
Binomial Cox-Ross-Rubinstein       3.843504      4.360861      4.486415
Additive equiprobabilities         3.836911      4.354455      4.480097
Binomial Trigeorgis                3.843557      4.360909      4.486461
Binomial Tian                      3.844171      4.361176      4.486413
Binomial Leisen-Reimer             3.844308      4.360713      4.486076
Binomial Joshi                     3.844308      4.360713      4.486076
MC (crude)                         3.834522      N/A           N/A
QMC (Sobol)                        3.844613      N/A           N/A
MC (Longstaff Schwartz)            N/A           N/A           4.456935

Run completed in 2 m 4 s
```

### Fitted bond curve

```
Today's date: April 18th, 2018
Bonds' settlement date: April 18th, 2018
Calculating fit for 15 bonds.....

(a) exponential splines
reference date : April 18th, 2018
number of iterations : 6877

(b) simple polynomial
reference date : April 18th, 2018
number of iterations : 284

(c) Nelson-Siegel
reference date : April 18th, 2018
number of iterations : 1200

(d) cubic B-splines
reference date : April 18th, 2018
number of iterations : 733

(e) Svensson
reference date : April 18th, 2018
number of iterations : 5000

(f) Nelson-Siegel spreaded
reference date : April 18th, 2018
number of iterations : 1501

Output par rates for each curve. In this case,
par rates should equal coupons for these par bonds.

 tenor | coupon | bstrap |    (a) |    (b) |    (c) |    (d) |    (e) |    (f)
 2.006 |  2.000 |  2.000 |  1.995 |  2.010 |  2.060 |  1.772 |  2.008 |  2.060
 4.003 |  2.250 |  2.250 |  2.251 |  2.256 |  2.266 |  2.397 |  2.225 |  2.266
 6.000 |  2.500 |  2.500 |  2.504 |  2.501 |  2.484 |  2.657 |  2.511 |  2.484
 8.006 |  2.750 |  2.750 |  2.754 |  2.747 |  2.716 |  2.749 |  2.772 |  2.716
10.000 |  3.000 |  3.000 |  3.002 |  2.993 |  2.959 |  2.905 |  3.012 |  2.959
12.000 |  3.250 |  3.250 |  3.250 |  3.241 |  3.214 |  3.195 |  3.247 |  3.214
14.003 |  3.500 |  3.500 |  3.498 |  3.491 |  3.477 |  3.522 |  3.486 |  3.477
16.000 |  3.750 |  3.750 |  3.747 |  3.742 |  3.745 |  3.796 |  3.731 |  3.745
18.000 |  4.000 |  4.000 |  3.997 |  3.996 |  4.017 |  4.016 |  3.985 |  4.017
20.003 |  4.250 |  4.250 |  4.248 |  4.252 |  4.286 |  4.232 |  4.246 |  4.286
22.000 |  4.500 |  4.500 |  4.500 |  4.507 |  4.548 |  4.478 |  4.510 |  4.548
24.000 |  4.750 |  4.750 |  4.752 |  4.761 |  4.797 |  4.745 |  4.772 |  4.797
26.003 |  5.000 |  5.000 |  5.004 |  5.012 |  5.029 |  5.014 |  5.025 |  5.029
28.000 |  5.250 |  5.250 |  5.252 |  5.254 |  5.236 |  5.267 |  5.258 |  5.236
30.006 |  5.500 |  5.500 |  5.497 |  5.485 |  5.416 |  5.485 |  5.464 |  5.416



Now add 23 months to today. Par rates should be
automatically recalculated because today's date
changes.  Par rates will NOT equal coupons (YTM
will, with the correct compounding), but the
piecewise yield curve par rates can be used as
a benchmark for correct par rates.

(a) exponential splines
reference date : March 18th, 2020
number of iterations : 923

(b) simple polynomial
reference date : March 18th, 2020
number of iterations : 275

(c) Nelson-Siegel
reference date : March 18th, 2020
number of iterations : 1009

(d) cubic B-splines
reference date : March 18th, 2020
number of iterations : 615

(e) Svensson
reference date : March 18th, 2020
number of iterations : 3054

(f) Nelson-Siegel spreaded
reference date : March 18th, 2020
number of iterations : 1017



 tenor | coupon | bstrap |    (a) |    (b) |    (c) |    (d) |    (e) |    (f)
 0.089 |  2.000 |  1.965 |  1.968 |  1.984 |  2.026 |  1.313 |  1.965 |  2.026
 2.086 |  2.250 |  2.248 |  2.244 |  2.249 |  2.256 |  2.333 |  2.235 |  2.256
 4.083 |  2.500 |  2.499 |  2.499 |  2.496 |  2.481 |  2.908 |  2.529 |  2.481
 6.089 |  2.750 |  2.749 |  2.751 |  2.744 |  2.717 |  3.012 |  2.766 |  2.717
 8.083 |  3.000 |  2.999 |  3.000 |  2.991 |  2.962 |  2.949 |  2.996 |  2.962
10.083 |  3.250 |  3.249 |  3.249 |  3.239 |  3.217 |  3.053 |  3.232 |  3.217
12.086 |  3.500 |  3.499 |  3.498 |  3.490 |  3.480 |  3.404 |  3.477 |  3.480
14.083 |  3.750 |  3.749 |  3.747 |  3.742 |  3.746 |  3.804 |  3.730 |  3.746
16.083 |  4.000 |  3.999 |  3.997 |  3.997 |  4.014 |  4.089 |  3.990 |  4.014
18.086 |  4.250 |  4.249 |  4.249 |  4.252 |  4.281 |  4.268 |  4.254 |  4.281
20.083 |  4.500 |  4.499 |  4.500 |  4.507 |  4.541 |  4.454 |  4.517 |  4.541
22.083 |  4.750 |  4.749 |  4.752 |  4.761 |  4.790 |  4.718 |  4.776 |  4.790
24.086 |  5.000 |  4.999 |  5.003 |  5.011 |  5.025 |  5.014 |  5.023 |  5.025
26.083 |  5.250 |  5.249 |  5.251 |  5.253 |  5.239 |  5.277 |  5.253 |  5.239
28.089 |  5.500 |  5.499 |  5.495 |  5.484 |  5.430 |  5.485 |  5.460 |  5.430



Now add one more month, for a total of two years
from the original date. The first instrument is
now expired and par rates should again equal
coupon values, since clean prices did not change.

(a) exponential splines
reference date : April 20th, 2020
number of iterations : 6896

(b) simple polynomial
reference date : April 20th, 2020
number of iterations : 270

(c) Nelson-Siegel
reference date : April 20th, 2020
number of iterations : 1075

(d) cubic B-splines
reference date : April 20th, 2020
number of iterations : 716

(e) Svensson
reference date : April 20th, 2020
number of iterations : 3581

(f) Nelson-Siegel spreaded
reference date : April 20th, 2020
number of iterations : 1751

 tenor | coupon | bstrap |    (a) |    (b) |    (c) |    (d) |    (e) |    (f)
 1.997 |  2.250 |  2.250 |  2.246 |  2.260 |  2.295 |  2.008 |  2.255 |  2.295
 3.994 |  2.500 |  2.500 |  2.501 |  2.504 |  2.508 |  2.655 |  2.483 |  2.508
 6.000 |  2.750 |  2.750 |  2.754 |  2.750 |  2.735 |  2.917 |  2.760 |  2.735
 7.994 |  3.000 |  3.000 |  3.002 |  2.995 |  2.971 |  2.998 |  3.014 |  2.971
 9.994 |  3.250 |  3.250 |  3.251 |  3.242 |  3.219 |  3.149 |  3.255 |  3.219
11.997 |  3.500 |  3.500 |  3.499 |  3.492 |  3.476 |  3.444 |  3.495 |  3.476
13.994 |  3.750 |  3.750 |  3.748 |  3.742 |  3.738 |  3.775 |  3.738 |  3.738
15.994 |  4.000 |  4.000 |  3.997 |  3.996 |  4.005 |  4.049 |  3.987 |  4.005
17.997 |  4.250 |  4.250 |  4.248 |  4.251 |  4.271 |  4.262 |  4.243 |  4.271
19.994 |  4.500 |  4.500 |  4.499 |  4.505 |  4.533 |  4.476 |  4.503 |  4.533
21.994 |  4.750 |  4.750 |  4.751 |  4.759 |  4.786 |  4.732 |  4.763 |  4.786
23.997 |  5.000 |  5.000 |  5.003 |  5.011 |  5.025 |  5.007 |  5.017 |  5.025
25.994 |  5.250 |  5.250 |  5.252 |  5.254 |  5.245 |  5.266 |  5.258 |  5.245
28.000 |  5.500 |  5.500 |  5.498 |  5.487 |  5.442 |  5.492 |  5.478 |  5.442



Now decrease prices by a small amount, corresponding
to a theoretical five basis point parallel + shift of
the yield curve. Because bond quotes change, the new
par rates should be recalculated automatically.

 tenor | coupon | bstrap |    (a) |    (b) |    (c) |    (d) |    (e) |    (f)
 1.997 |  2.250 |  2.300 |  2.298 |  2.311 |  2.345 |  2.055 |  2.305 |  2.345
 3.994 |  2.500 |  2.550 |  2.551 |  2.555 |  2.558 |  2.706 |  2.533 |  2.558
 6.000 |  2.750 |  2.800 |  2.803 |  2.799 |  2.784 |  2.968 |  2.810 |  2.784
 7.994 |  3.000 |  3.050 |  3.051 |  3.044 |  3.021 |  3.048 |  3.064 |  3.021
 9.994 |  3.250 |  3.299 |  3.299 |  3.291 |  3.268 |  3.197 |  3.305 |  3.268
11.997 |  3.500 |  3.549 |  3.548 |  3.540 |  3.525 |  3.492 |  3.544 |  3.525
13.994 |  3.750 |  3.798 |  3.796 |  3.790 |  3.787 |  3.824 |  3.786 |  3.787
15.994 |  4.000 |  4.048 |  4.045 |  4.043 |  4.053 |  4.097 |  4.035 |  4.053
17.997 |  4.250 |  4.298 |  4.296 |  4.298 |  4.319 |  4.310 |  4.291 |  4.319
19.994 |  4.500 |  4.547 |  4.547 |  4.553 |  4.580 |  4.523 |  4.550 |  4.580
21.994 |  4.750 |  4.797 |  4.798 |  4.807 |  4.833 |  4.778 |  4.810 |  4.833
23.997 |  5.000 |  5.046 |  5.049 |  5.057 |  5.072 |  5.053 |  5.063 |  5.072
25.994 |  5.250 |  5.296 |  5.297 |  5.300 |  5.290 |  5.311 |  5.303 |  5.290
28.000 |  5.500 |  5.545 |  5.542 |  5.532 |  5.486 |  5.537 |  5.523 |  5.486

Run completed in 8 m 44 s
```

### FRA

```
Today: Tuesday, May 23rd, 2006
Settlement date: Thursday, May 25th, 2006

Test FRA construction, NPV calculation, and FRA purchase

3m Term FRA, Months to Start: 1
strike FRA rate: 3.000000 %
FRA 3m forward rate: 3.000000 % Actual/360 simple compounding
FRA market quote: 3.000000 %
FRA spot value: 99.7347
FRA forward value: 100.767
FRA implied Yield: 3.003993 % Actual/360 simple compounding
market Zero Rate: 3.003993 % Actual/360 simple compounding
FRA NPV [should be zero]: 0

3m Term FRA, Months to Start: 2
strike FRA rate: 3.100000 %
FRA 3m forward rate: 3.100000 % Actual/360 simple compounding
FRA market quote: 3.100000 %
FRA spot value: 99.4949
FRA forward value: 100.792
FRA implied Yield: 3.068054 % Actual/360 simple compounding
market Zero Rate: 3.068054 % Actual/360 simple compounding
FRA NPV [should be zero]: 0

3m Term FRA, Months to Start: 3
strike FRA rate: 3.200000 %
FRA 3m forward rate: 3.200000 % Actual/360 simple compounding
FRA market quote: 3.200000 %
FRA spot value: 99.2392
FRA forward value: 100.836
FRA implied Yield: 3.113474 % Actual/360 simple compounding
market Zero Rate: 3.113474 % Actual/360 simple compounding
FRA NPV [should be zero]: 0

3m Term FRA, Months to Start: 6
strike FRA rate: 3.300000 %
FRA 3m forward rate: 3.300000 % Actual/360 simple compounding
FRA market quote: 3.300000 %
FRA spot value: 98.4168
FRA forward value: 100.843
FRA implied Yield: 3.192770 % Actual/360 simple compounding
market Zero Rate: 3.192770 % Actual/360 simple compounding
FRA NPV [should be zero]: 1.38689e-14

3m Term FRA, Months to Start: 9
strike FRA rate: 3.400000 %
FRA 3m forward rate: 3.400000 % Actual/360 simple compounding
FRA market quote: 3.400000 %
FRA spot value: 97.6027
FRA forward value: 100.859
FRA implied Yield: 3.264191 % Actual/360 simple compounding
market Zero Rate: 3.264191 % Actual/360 simple compounding
FRA NPV [should be zero]: 2.7504e-14



Now take a 100 basis-point upward shift in FRA quotes and examine NPV

3m Term FRA, 100 notional, Months to Start = 1
strike FRA rate: 3.000000 %
FRA 3m forward rate: 4.000000 % Actual/360 simple compounding
FRA market quote: 4.000000 %
FRA spot value: 99.6469
FRA forward value: 101.022
FRA implied Yield: 4.007095 % Actual/360 simple compounding
market Zero Rate: 4.007095 % Actual/360 simple compounding
FRA NPV [should be positive]: 0.252076

3m Term FRA, 100 notional, Months to Start = 2
strike FRA rate: 3.100000 %
FRA 3m forward rate: 4.100000 % Actual/360 simple compounding
FRA market quote: 4.100000 %
FRA spot value: 99.3279
FRA forward value: 101.048
FRA implied Yield: 4.074078 % Actual/360 simple compounding
market Zero Rate: 4.074078 % Actual/360 simple compounding
FRA NPV [should be positive]: 0.251206

3m Term FRA, 100 notional, Months to Start = 3
strike FRA rate: 3.200000 %
FRA 3m forward rate: 4.200000 % Actual/360 simple compounding
FRA market quote: 4.200000 %
FRA spot value: 98.9881
FRA forward value: 101.097
FRA implied Yield: 4.122773 % Actual/360 simple compounding
market Zero Rate: 4.122773 % Actual/360 simple compounding
FRA NPV [should be positive]: 0.255665

3m Term FRA, 100 notional, Months to Start = 6
strike FRA rate: 3.300000 %
FRA 3m forward rate: 4.300000 % Actual/360 simple compounding
FRA market quote: 4.300000 %
FRA spot value: 97.9143
FRA forward value: 101.099
FRA implied Yield: 4.211735 % Actual/360 simple compounding
market Zero Rate: 4.211735 % Actual/360 simple compounding
FRA NPV [should be positive]: 0.247506

3m Term FRA, 100 notional, Months to Start = 9
strike FRA rate: 3.400000 %
FRA 3m forward rate: 4.400000 % Actual/360 simple compounding
FRA market quote: 4.400000 %
FRA spot value: 96.8616
FRA forward value: 101.112
FRA implied Yield: 4.292991 % Actual/360 simple compounding
market Zero Rate: 4.292991 % Actual/360 simple compounding
FRA NPV [should be positive]: 0.242151


Run completed in 1 s
```

### Gaussian 1D models

```
Gaussian1dModel Examples

This is some example code showing how to use the GSR
(Gaussian short rate) and Markov Functional model.

The evaluation date for this example is set to April 30th, 2014

We assume a multicurve setup, for simplicity with flat yield
term structures. The discounting curve is an Eonia curve at
a level of 0.02 and the forwarding curve is an Euribior 6m curve
at a level of 0.025

For the volatility we assume a flat swaption volatility at 0.2

We consider a standard 10y bermudan payer swaption
with yearly exercises at a strike of 0.04

The model is a one factor Hull White model with piecewise
volatility adapted to our exercise dates.

The reversion is just kept constant at a level of 0.01

The model's curve is set to the 6m forward curve. Note that
the model adapts automatically to other curves where appropriate
(e.g. if an index requires a different forwarding curve) or
where explicitly specified (e.g. in a swaption pricing engine).

The engine can generate a calibration basket in two modes.
The first one is called Naive and generates ATM swaptions adapted to
the exercise dates of the swaption and its maturity date

The resulting basket looks as follows:

Expiry              Maturity            Nominal             Rate          Pay/Re
c     Market ivol
================================================================================
==================
April 30th, 2015    May 6th, 2024       1.000000            0.025307      Receiv
er    0.200000
May 3rd, 2016       May 6th, 2024       1.000000            0.025300      Receiv
er    0.200000
May 3rd, 2017       May 6th, 2024       1.000000            0.025303      Receiv
er    0.200000
May 3rd, 2018       May 6th, 2024       1.000000            0.025306      Receiv
er    0.200000
May 2nd, 2019       May 6th, 2024       1.000000            0.025311      Receiv
er    0.200000
April 30th, 2020    May 6th, 2024       1.000000            0.025300      Receiv
er    0.200000
May 3rd, 2021       May 6th, 2024       1.000000            0.025306      Receiv
er    0.200000
May 3rd, 2022       May 6th, 2024       1.000000            0.025318      Receiv
er    0.200000
May 3rd, 2023       May 6th, 2024       1.000000            0.025353      Receiv
er    0.200000

(this step took 0.0s)

Let's calibrate our model to this basket. We use a specialized
calibration method calibrating the sigma function one by one to
the calibrating vanilla swaptions. The result of this is as follows:

Expiry              Model sigma   Model price         market price        Model
ivol    Market ivol
================================================================================
====================
April 30th, 2015    0.005178      0.016111            0.016111            0.1999
99      0.200000
May 3rd, 2016       0.005156      0.020062            0.020062            0.2000
00      0.200000
May 3rd, 2017       0.005149      0.021229            0.021229            0.2000
00      0.200000
May 3rd, 2018       0.005129      0.020738            0.020738            0.2000
00      0.200000
May 2nd, 2019       0.005132      0.019096            0.019096            0.2000
00      0.200000
April 30th, 2020    0.005074      0.016537            0.016537            0.2000
00      0.200000
May 3rd, 2021       0.005091      0.013253            0.013253            0.2000
00      0.200000
May 3rd, 2022       0.005097      0.009342            0.009342            0.2000
00      0.200000
May 3rd, 2023       0.005001      0.004910            0.004910            0.2000
00      0.200000

(this step took 75.4s)

Finally we price our bermudan swaption in the calibrated model:

Bermudan swaption NPV (ATM calibrated GSR) = 0.003808

(this step took 19.4s)

There is another mode to generate a calibration basket called
MaturityStrikeByDeltaGamma. This means that the maturity,
the strike and the nominal of the calibrating swaption are
computed such that the npv and its first and second
derivative with respect to the model's state variable) of
the exotics underlying match with the calibrating swaption's
underlying. Let's try this in our case.

Expiry              Maturity            Nominal             Rate          Pay/Re
c     Market ivol
================================================================================
==================
April 30th, 2015    May 6th, 2024       1.000010            0.040000      Payer
      0.200000
May 3rd, 2016       May 6th, 2024       0.999995            0.040000      Payer
      0.200000
May 3rd, 2017       May 6th, 2024       1.000002            0.040000      Payer
      0.200000
May 3rd, 2018       May 7th, 2024       0.999935            0.040000      Payer
      0.200000
May 2nd, 2019       May 6th, 2024       0.999917            0.040000      Payer
      0.200000
April 30th, 2020    May 6th, 2024       1.000000            0.040000      Payer
      0.200000
May 3rd, 2021       May 6th, 2024       1.000001            0.040000      Payer
      0.200000
May 3rd, 2022       May 6th, 2024       0.999995            0.040000      Payer
      0.200000
May 3rd, 2023       May 6th, 2024       0.999996            0.040000      Payer
      0.200000

(this step took 10.1s)

The calibrated nominal is close to the exotics nominal.
The expiries and maturity dates of the vanillas are the same
as in the case above. The difference is the strike which
is now equal to the exotics strike.

Let's see how this affects the exotics npv. The
recalibrated model is:

Expiry              Model sigma   Model price         market price        Model
ivol    Market ivol
================================================================================
====================
April 30th, 2015    0.006508      0.000191            0.000191            0.2000
00      0.200000
May 3rd, 2016       0.006502      0.001412            0.001412            0.2000
00      0.200000
May 3rd, 2017       0.006480      0.002905            0.002905            0.2000
00      0.200000
May 3rd, 2018       0.006464      0.004091            0.004091            0.2000
00      0.200000
May 2nd, 2019       0.006422      0.004766            0.004766            0.2000
00      0.200000
April 30th, 2020    0.006445      0.004869            0.004869            0.2000
00      0.200000
May 3rd, 2021       0.006433      0.004433            0.004433            0.2000
00      0.200000
May 3rd, 2022       0.006332      0.003454            0.003454            0.2000
00      0.200000
May 3rd, 2023       0.006295      0.001973            0.001973            0.2000
00      0.200000

(this step took 72.7s)

And the bermudan's price becomes:

Bermudan swaption NPV (deal strike calibrated GSR) = 0.007627

(this step took 16.8s)

We can do more complicated things, let's e.g. modify the
nominal schedule to be linear amortizing and see what
the effect on the generated calibration basket is:

Expiry              Maturity            Nominal             Rate          Pay/Re
c     Market ivol
================================================================================
==================
April 30th, 2015    August 5th, 2021    0.719229            0.039997      Payer
      0.200000
May 3rd, 2016       December 6th, 2021  0.641951            0.040003      Payer
      0.200000
May 3rd, 2017       May 5th, 2022       0.564391            0.040005      Payer
      0.200000
May 3rd, 2018       September 7th, 2022 0.486528            0.040004      Payer
      0.200000
May 2nd, 2019       January 6th, 2023   0.409771            0.040008      Payer
      0.200000
April 30th, 2020    May 5th, 2023       0.334095            0.039994      Payer
      0.200000
May 3rd, 2021       September 5th, 2023 0.255749            0.039995      Payer
      0.200000
May 3rd, 2022       January 5th, 2024   0.177039            0.040031      Payer
      0.200000
May 3rd, 2023       May 6th, 2024       0.100000            0.040000      Payer
      0.200000

(this step took 13.4s)

The notional is weighted over the underlying exercised
into and the maturity is adjusted downwards. The rate
on the other hand is not affected.

You can also price exotic bond's features. If you have e.g. a
bermudan callable fixed bond you can set up the call right
as a swaption to enter into a one leg swap with notional
reimbursement at maturity.
The exercise should then be written as a rebated exercise
paying the notional in case of exercise.

The calibration basket looks like this:

Expiry              Maturity            Nominal             Rate          Pay/Re
c     Market ivol
================================================================================
==================
April 30th, 2015    April 5th, 2024     0.984114            0.039952      Payer
      0.200000
May 3rd, 2016       April 5th, 2024     0.985541            0.039952      Payer
      0.200000
May 3rd, 2017       May 6th, 2024       0.987057            0.039952      Payer
      0.200000
May 3rd, 2018       May 7th, 2024       0.988446            0.039952      Payer
      0.200000
May 2nd, 2019       May 6th, 2024       0.990029            0.039952      Payer
      0.200000
April 30th, 2020    May 6th, 2024       0.991636            0.039951      Payer
      0.200000
May 3rd, 2021       May 6th, 2024       0.993124            0.039951      Payer
      0.200000
May 3rd, 2022       May 6th, 2024       0.994196            0.039952      Payer
      0.200000
May 3rd, 2023       May 6th, 2024       0.996664            0.039949      Payer
      0.200000

(this step took 10.3s)

Note that nominals are not exactly 1.0 here. This is
because we do our bond discounting on 6m level while
the swaptions are still discounted on OIS level.
(You can try this by changing the OIS level to the
6m level, which will produce nominals near 1.0).
The npv of the call right is (after recalibrating the model)

Bond's bermudan call right npv = 0.115409

(this step took 66.0s)

Up to now, no credit spread is included in the pricing.
We can do so by specifying an oas in the pricing engine.
Let's set the spread level to 100bp and regenerate
the calibration basket.

Expiry              Maturity            Nominal             Rate          Pay/Re
c     Market ivol
================================================================================
==================
April 30th, 2015    February 5th, 2024  0.961299            0.029608      Payer
      0.200000
May 3rd, 2016       March 5th, 2024     0.965343            0.029605      Payer
      0.200000
May 3rd, 2017       April 5th, 2024     0.969516            0.029608      Payer
      0.200000
May 3rd, 2018       April 8th, 2024     0.973622            0.029610      Payer
      0.200000
May 2nd, 2019       April 8th, 2024     0.978116            0.029608      Payer
      0.200000
April 30th, 2020    May 6th, 2024       0.982678            0.029612      Payer
      0.200000
May 3rd, 2021       May 6th, 2024       0.987283            0.029609      Payer
      0.200000
May 3rd, 2022       May 6th, 2024       0.991382            0.029603      Payer
      0.200000
May 3rd, 2023       May 6th, 2024       0.996618            0.029586      Payer
      0.200000

(this step took 13.5s)

The adjusted basket takes the credit spread into account.
This is consistent to a hedge where you would have a
margin on the float leg around 100bp,too.

The npv becomes:

Bond's bermudan call right npv (oas = 100bp) = 0.044980

(this step took 78.4s)

The next instrument we look at is a CMS 10Y vs Euribor
6M swaption. The maturity is again 10 years and the option
is exercisable on a yearly basis

Since the underlying is quite exotic already, we start with
pricing this using the LinearTsrPricer for CMS coupon estimation
Underlying CMS Swap NPV = 0.004447
       CMS     Leg  NPV = -0.231736
       Euribor Leg  NPV = 0.236183

(this step took 0.2s)

We generate a naive calibration basket and calibrate
the GSR model to it:

Expiry              Maturity            Nominal             Rate          Pay/Re
c     Market ivol
================================================================================
==================
April 30th, 2015    May 6th, 2024       1.000000            0.025307      Receiv
er    0.200000
May 3rd, 2016       May 6th, 2024       1.000000            0.025300      Receiv
er    0.200000
May 3rd, 2017       May 6th, 2024       1.000000            0.025303      Receiv
er    0.200000
May 3rd, 2018       May 6th, 2024       1.000000            0.025306      Receiv
er    0.200000
May 2nd, 2019       May 6th, 2024       1.000000            0.025311      Receiv
er    0.200000
April 30th, 2020    May 6th, 2024       1.000000            0.025300      Receiv
er    0.200000
May 3rd, 2021       May 6th, 2024       1.000000            0.025306      Receiv
er    0.200000
May 3rd, 2022       May 6th, 2024       1.000000            0.025318      Receiv
er    0.200000
May 3rd, 2023       May 6th, 2024       1.000000            0.025353      Receiv
er    0.200000

Expiry              Model sigma   Model price         market price        Model
ivol    Market ivol
================================================================================
====================
April 30th, 2015    0.005178      0.016111            0.016111            0.2000
00      0.200000
May 3rd, 2016       0.005156      0.020062            0.020062            0.2000
00      0.200000
May 3rd, 2017       0.005149      0.021229            0.021229            0.2000
00      0.200000
May 3rd, 2018       0.005129      0.020738            0.020738            0.2000
00      0.200000
May 2nd, 2019       0.005132      0.019096            0.019096            0.2000
00      0.200000
April 30th, 2020    0.005074      0.016537            0.016537            0.2000
00      0.200000
May 3rd, 2021       0.005091      0.013253            0.013253            0.2000
00      0.200000
May 3rd, 2022       0.005097      0.009342            0.009342            0.2000
00      0.200000
May 3rd, 2023       0.005001      0.004910            0.004910            0.2000
00      0.200000

(this step took 58.3s)

The npv of the bermudan swaption is

Float swaption NPV (GSR) = 0.004291

(this step took 58.6s)

In this case it is also interesting to look at the
underlying swap npv in the GSR model.

Float swap NPV (GSR) = 0.005250

Not surprisingly, the underlying is priced differently
compared to the LinearTsrPricer, since a different
smile is implied by the GSR model.

This is exactly where the Markov functional model
comes into play, because it can calibrate to any
given underlying smile (as long as it is arbitrage
free). We try this now. Of course the usual use case
is not to calibrate to a flat smile as in our simple
example, still it should be possible, of course...

The option npv is the markov model is:

Float swaption NPV (Markov) = 0.003549

(this step took 15.7s)

This is not too far from the GSR price.

More interesting is the question how well the Markov
model did its job to match our input smile. For this
we look at the underlying npv under the Markov model

Float swap NPV (Markov) = 0.004301

This is closer to our terminal swap rate model price.
A perfect match is not expected anyway, because the
dynamics of the underlying rate in the linear
model is different from the Markov model, of
course.

The Markov model can not only calibrate to the
underlying smile, but has at the same time a
sigma function (similar to the GSR model) which
can be used to calibrate to a second instrument
set. We do this here to calibrate to our coterminal
ATM swaptions from above.

This is a computationally demanding task, so
depending on your machine, this may take a
while now...

Expiry              Model sigma   Model price         market price        Model
ivol    Market ivol
================================================================================
====================
April 30th, 2015    0.010000      0.016111            0.016111            0.1999
96      0.200000
May 3rd, 2016       0.012276      0.020062            0.020062            0.2000
02      0.200000
May 3rd, 2017       0.010535      0.021229            0.021229            0.2000
00      0.200000
May 3rd, 2018       0.010414      0.020738            0.020738            0.2000
00      0.200000
May 2nd, 2019       0.010360      0.019096            0.019096            0.1999
99      0.200000
April 30th, 2020    0.010340      0.016537            0.016537            0.2000
01      0.200000
May 3rd, 2021       0.010365      0.013253            0.013253            0.1999
99      0.200000
May 3rd, 2022       0.010382      0.009342            0.009342            0.2000
01      0.200000
May 3rd, 2023       0.010392      0.004910            0.004910            0.2000
00      0.200000
                    0.009959

(this step took 751.5s)

Now let's have a look again at the underlying pricing.
It shouldn't have changed much, because the underlying
smile is still matched.

Float swap NPV (Markov) = 0.004331

(this step took 13.8s)

This is close to the previous value as expected.

As a final remark we note that the calibration to
coterminal swaptions is not particularly reasonable
here, because the european call rights are not
well represented by these swaptions.
Secondly, our CMS swaption is sensitive to the
correlation between the 10y swap rate and the
Euribor 6M rate. Since the Markov model is one factor
it will most probably underestimate the market value
by construction.

That was it. Thank you for running this demo. Bye.

```
### Global Optimizer
```
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Firefly Algorithm Test
----------------------------------------------------------------
Function eggholder, Agents: 150, Vola: 1.5, Intensity: 1
Starting point:  f(0, 0) = -25.4603
End point:  f(512, 404.232) = -959.641
Global optimium:  f(512, 404.232) = -959.641
================================================================

Run completed in 5 s

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Hybrid Simulated Annealing Test
----------------------------------------------------------------
Function: ackley, Dimensions: 3, Initial temp:100, Final temp:0, Reset scheme:1, Reset steps:150
Starting point:  f(2, 2, 2) = 9
End point:  f(0, -0, 0) = -2
Global optimium:  f(0, 0, 0) = -2
================================================================
Function: ackley, Dimensions: 10, Initial temp:100, Final temp:0, Reset scheme:1, Reset steps:150
Starting point:  f(2, 2, 2, 2, 2, 2, 2, 2, 2, 2) = 12
End point:  f(19, -9, 37, 26, 43, 126, 40, -39, -38, 12) = -126
Global optimium:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = -146
================================================================
Function: ackley, Dimensions: 30, Initial temp:100, Final temp:0, Reset scheme:1, Reset steps:150
Starting point:  f(2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2) = 16
End point:  f(-14, -2, 22, 12, 13, 10, 10, 13, -12, -1, 2, 4, -24, 22, -1, 15, 18, -5, -2, 10, 12, 12, -14, -2, 13, 19, 16, 1, 22, -13) = -186184
Global optimium:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = -3269015
================================================================

Run completed in 5 s

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Particle Swarm Optimization Test
----------------------------------------------------------------
Function: rosenbrock, Dimensions: 3, Agents: 100, K-neighbors: 25, Threshold: 500
Starting point:  f(0, 0, 0) = 2
End point:  f(1, 1, 1) = 0
Global optimium:  f(1, 1, 1) = 0
================================================================
Function: rosenbrock, Dimensions: 10, Agents: 100, K-neighbors: 25, Threshold: 500
Starting point:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = 9
End point:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
Global optimium:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
================================================================
Function: rosenbrock, Dimensions: 30, Agents: 100, K-neighbors: 25, Threshold: 500
Starting point:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = 29
End point:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
Global optimium:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
================================================================

Run completed in 16 s

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Simulated Annealing Test
----------------------------------------------------------------
Function ackley, Lambda: 0, Temperature: 350, Epsilon: 1, Iterations: 1000
Starting point:  f(2, 2, 2) = 9
End point:  f(-0, 0, 0) = 0
Global optimium:  f(0, 0, 0) = -2
================================================================
Function ackley, Lambda: 0, Temperature: 350, Epsilon: 1, Iterations: 1000
Starting point:  f(2, 2, 2, 2, 2, 2, 2, 2, 2, 2) = 12
End point:  f(4, -0, 3, 1, 3, 1, -0, 2, -2, 3) = -72
Global optimium:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = -146
================================================================
Function ackley, Lambda: 0, Temperature: 350, Epsilon: 1, Iterations: 1000
Starting point:  f(2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2) = 16
End point:  f(2, 2, 1, 2, 2, 2, 1, 2, -0, -0, 3, 1, 2, 2, 2, -0, 1, 2, 1, 1, -0, 2, 3, 2, -0, 1, 3, 2, 1, 3) = -757934
Global optimium:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = -3269015
================================================================

Run completed in 16 s

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Differential Evolution Test
----------------------------------------------------------------
Function: rosenbrock, Dimensions: 3, Agents: 50, Probability: 0, StepsizeWeight: 1, Strategy: BestMemberWithJitter
Starting point:  f(0, 0, 0) = 2
End point:  f(1, 1, 1) = 0
Global optimium:  f(1, 1, 1) = 0
================================================================
Function: rosenbrock, Dimensions: 10, Agents: 150, Probability: 0, StepsizeWeight: 1, Strategy: BestMemberWithJitter
Starting point:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = 9
End point:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
Global optimium:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
================================================================
Function: rosenbrock, Dimensions: 30, Agents: 450, Probability: 0, StepsizeWeight: 1, Strategy: BestMemberWithJitter
Starting point:  f(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) = 29
End point:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
Global optimium:  f(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1) = 0
================================================================

Run completed in 38 s
```

### Latent Model

```
 Gaussian versus T prob of extreme event (random and integrable)-
-Prob of 0 events... 1 ** 0.99999 ** 1 ** 1
-Prob of 1 events... 0.252189 ** 0.249196 ** 0.2524 ** 0.24917
-Prob of 2 events... 0.0328963 ** 0.0336561 ** 0.03279 ** 0.03368
-Prob of 3 events... 0.00199248 ** 0.00421316 ** 0.00201 ** 0.0041

-- Default correlations G,T,GRand,TRand--
-----------------------------------------
1 , 0.00935891 , 0.00935891 ,
0.00935891 , 1 , 0.00935891 ,
0.00935891 , 0.00935891 , 1 ,

1 , 0.031698 , 0.031698 ,
0.031698 , 1 , 0.031698 ,
0.031698 , 0.031698 , 1 ,

1.00001 , 0.00827934 , 0.00517704 ,
0.00827934 , 1.00001 , 0.0103137 ,
0.00517704 , 0.0103137 , 1.00001 ,

1.00001 , 0.0305301 , 0.0283078 ,
0.0305301 , 1.00001 , 0.0323241 ,
0.0283078 , 0.0323241 , 1.00001 ,
Run completed in 7 s
```

### Market models

```
 inverse floater
 fixed strikes :  0.15
 number rates :  20
training paths, 65536
paths, 65536
vega Paths, 16384
 rate level 0.05
-0.0161955
0.0870706
 time to build strategy, 12.408, seconds.
 time to price, 20.514, seconds.
vega output
 factorwise bumping 0
 doCaps 0
 price estimate, 0.0868184
 Delta, 0, 1.31847, 0.00195094
 Delta, 1, 1.20837, 0.00329279
 Delta, 2, 1.09916, 0.00402968
 Delta, 3, 0.994986, 0.00443145
 Delta, 4, 0.901078, 0.00465025
 Delta, 5, 0.821622, 0.00472748
 Delta, 6, 0.748171, 0.00472779
 Delta, 7, 0.676147, 0.00467372
 Delta, 8, 0.614106, 0.0045757
 Delta, 9, 0.559666, 0.00445411
 Delta, 10, 0.513673, 0.00432688
 Delta, 11, 0.470293, 0.00417286
 Delta, 12, 0.427822, 0.00400984
 Delta, 13, 0.390045, 0.00384228
 Delta, 14, 0.358827, 0.00371168
 Delta, 15, 0.328362, 0.00355612
 Delta, 16, 0.298648, 0.00339936
 Delta, 17, 0.268562, 0.00321725
 Delta, 18, 0.241715, 0.00303437
 Delta, 19, 0.19752, 0.00277139
 vega, 0, 0.000537163 ,0
 vega, 1, 0.000512241 ,0
 vega, 2, 0.000531272 ,0
 vega, 3, 0.00080581 ,0
 vega, 4, 0.000521218 ,0
 vega, 5, 0.000474379 ,0
 vega, 6, 0.000321862 ,0
 vega, 7, 0.000650717 ,0
 vega, 8, 0.000228025 ,0
 vega, 9, 0.000366575 ,0
 vega, 10, 0.000109168 ,0
 vega, 11, 4.29782e-005 ,0
 vega, 12, 0.000167156 ,0
 vega, 13, 0.000127076 ,0
 vega, 14, 0.000147648 ,0
 vega, 15, -2.24295e-005 ,0
 vega, 16, 1.19248e-005 ,0
 vega, 17, -5.85746e-005 ,0
 vega, 18, -4.45364e-005 ,0
 vega, 19, 2.61674e-005 ,0
 total Vega, 0.00545584
vega output
 factorwise bumping 1
 doCaps 0
 price estimate, 0.0868184
 Delta, 0, 1.31847, 0.00195094
 Delta, 1, 1.20837, 0.00329279
 Delta, 2, 1.09916, 0.00402968
 Delta, 3, 0.994986, 0.00443145
 Delta, 4, 0.901078, 0.00465025
 Delta, 5, 0.821622, 0.00472748
 Delta, 6, 0.748171, 0.00472779
 Delta, 7, 0.676147, 0.00467372
 Delta, 8, 0.614106, 0.0045757
 Delta, 9, 0.559666, 0.00445411
 Delta, 10, 0.513673, 0.00432688
 Delta, 11, 0.470293, 0.00417286
 Delta, 12, 0.427822, 0.00400984
 Delta, 13, 0.390045, 0.00384228
 Delta, 14, 0.358827, 0.00371168
 Delta, 15, 0.328362, 0.00355612
 Delta, 16, 0.298648, 0.00339936
 Delta, 17, 0.268562, 0.00321725
 Delta, 18, 0.241715, 0.00303437
 Delta, 19, 0.19752, 0.00277139
 vega, 0, 0.000178754 ,0
 vega, 1, 0.000697929 ,0
 vega, 2, 0.000665821 ,0
 vega, 3, 0.000784743 ,0
 vega, 4, 0.000552831 ,0
 vega, 5, 0.000512852 ,0
 vega, 6, 0.000308864 ,0
 vega, 7, 0.000361828 ,0
 vega, 8, 0.000269135 ,0
 vega, 9, 0.000141886 ,0
 vega, 10, 0.000139578 ,0
 vega, 11, 1.36155e-005 ,0
 vega, 12, 9.69753e-005 ,0
 vega, 13, 8.70213e-006 ,0
 vega, 14, 0.000134429 ,0
 vega, 15, 3.91366e-007 ,0
 vega, 16, 3.4873e-005 ,0
 vega, 17, 7.48356e-006 ,0
 vega, 18, -4.19783e-006 ,0
 vega, 19, 1.37192e-005 ,0
 total Vega, 0.00492021
vega output
 factorwise bumping 0
 doCaps 1
 price estimate, 0.0868184
 Delta, 0, 1.31847, 0.00195094
 Delta, 1, 1.20837, 0.00329279
 Delta, 2, 1.09916, 0.00402968
 Delta, 3, 0.994986, 0.00443145
 Delta, 4, 0.901078, 0.00465025
 Delta, 5, 0.821622, 0.00472748
 Delta, 6, 0.748171, 0.00472779
 Delta, 7, 0.676147, 0.00467372
 Delta, 8, 0.614106, 0.0045757
 Delta, 9, 0.559666, 0.00445411
 Delta, 10, 0.513673, 0.00432688
 Delta, 11, 0.470293, 0.00417286
 Delta, 12, 0.427822, 0.00400984
 Delta, 13, 0.390045, 0.00384228
 Delta, 14, 0.358827, 0.00371168
 Delta, 15, 0.328362, 0.00355612
 Delta, 16, 0.298648, 0.00339936
 Delta, 17, 0.268562, 0.00321725
 Delta, 18, 0.241715, 0.00303437
 Delta, 19, 0.19752, 0.00277139
 vega, 0, 0.000205662 ,0
 vega, 1, 0.000357761 ,0
 vega, 2, 0.000436371 ,0
 vega, 3, 0.000744637 ,0
 vega, 4, 0.000350999 ,0
 vega, 5, 0.000304823 ,0
 vega, 6, 7.29906e-005 ,0
 vega, 7, 0.000682534 ,0
 vega, 8, 0.000155682 ,0
 vega, 9, 0.000403977 ,0
 vega, 10, 0.000157902 ,0
 vega, 11, -0.000147974 ,0
 vega, 12, 0.00017657 ,0
 vega, 13, -9.63953e-007 ,0
 vega, 14, 0.000438237 ,0
 vega, 15, -5.99954e-005 ,0
 vega, 16, 1.25568e-005 ,0
 vega, 17, 5.63731e-005 ,0
 vega, 18, 9.71559e-005 ,0
 vega, 19, 0.000129229 ,0
 vega, 20, 0.000181069 ,0
 vega, 21, 0.000217585 ,0
 vega, 22, 0.000255643 ,0
 vega, 23, 0.000203047 ,0
 vega, 24, 0.000182118 ,0
 vega, 25, 0.000142711 ,0
 vega, 26, 0.000110869 ,0
 vega, 27, 0.000134469 ,0
 vega, 28, 0.000116228 ,0
 vega, 29, 7.04043e-005 ,0
 vega, 30, 7.04779e-005 ,0
 vega, 31, -7.70875e-005 ,0
 vega, 32, -6.01727e-005 ,0
 vega, 33, -6.67757e-005 ,0
 vega, 34, -6.83066e-005 ,0
 total Vega, 0.00598681
vega output
 factorwise bumping 1
 doCaps 1
 price estimate, 0.0868184
 Delta, 0, 1.31847, 0.00195094
 Delta, 1, 1.20837, 0.00329279
 Delta, 2, 1.09916, 0.00402968
 Delta, 3, 0.994986, 0.00443145
 Delta, 4, 0.901078, 0.00465025
 Delta, 5, 0.821622, 0.00472748
 Delta, 6, 0.748171, 0.00472779
 Delta, 7, 0.676147, 0.00467372
 Delta, 8, 0.614106, 0.0045757
 Delta, 9, 0.559666, 0.00445411
 Delta, 10, 0.513673, 0.00432688
 Delta, 11, 0.470293, 0.00417286
 Delta, 12, 0.427822, 0.00400984
 Delta, 13, 0.390045, 0.00384228
 Delta, 14, 0.358827, 0.00371168
 Delta, 15, 0.328362, 0.00355612
 Delta, 16, 0.298648, 0.00339936
 Delta, 17, 0.268562, 0.00321725
 Delta, 18, 0.241715, 0.00303437
 Delta, 19, 0.19752, 0.00277139
 vega, 0, 0.000132367 ,0
 vega, 1, 0.000541302 ,0
 vega, 2, 0.000489328 ,0
 vega, 3, 0.000706567 ,0
 vega, 4, 0.000491309 ,0
 vega, 5, 0.000519181 ,0
 vega, 6, 0.000339452 ,0
 vega, 7, 0.000464215 ,0
 vega, 8, 0.000386056 ,0
 vega, 9, 0.000232674 ,0
 vega, 10, 0.000231736 ,0
 vega, 11, 6.23271e-005 ,0
 vega, 12, 0.000238341 ,0
 vega, 13, 4.32892e-005 ,0
 vega, 14, 0.000255305 ,0
 vega, 15, 1.06151e-005 ,0
 vega, 16, 9.40421e-005 ,0
 vega, 17, 2.23203e-005 ,0
 vega, 18, -7.00994e-005 ,0
 vega, 19, -2.28062e-005 ,0
 vega, 20, 1.6436e-005 ,0
 vega, 21, 5.699e-005 ,0
 vega, 22, 8.61217e-005 ,0
 vega, 23, 8.56206e-005 ,0
 vega, 24, 8.37583e-005 ,0
 vega, 25, 7.14288e-005 ,0
 vega, 26, 5.80925e-005 ,0
 vega, 27, 3.55289e-005 ,0
 vega, 28, 1.35357e-005 ,0
 vega, 29, -2.1889e-006 ,0
 vega, 30, -1.67405e-005 ,0
 vega, 31, -2.32349e-005 ,0
 vega, 32, -4.42788e-005 ,0
 vega, 33, -4.67575e-005 ,0
 vega, 34, -6.48239e-005 ,0
 vega, 35, -6.13788e-005 ,0
 vega, 36, -6.87918e-005 ,0
 vega, 37, -6.52544e-005 ,0
 vega, 38, -3.13134e-005 ,0
 total Vega, 0.00525027
 Upper - lower is, 0.00545744, with standard error 0.000555712
 time to compute upper bound is,  72.417, seconds.
 inverse floater
 fixed strikes :  0.15
 number rates :  20
training paths, 65536
paths, 65536
vega Paths, 16384
 rate level 0.06
0.172515
0.21654
 time to build strategy, 12.546, seconds.
 time to price, 18.828, seconds.
vega output
 factorwise bumping 0
 doCaps 0
 price estimate, 0.216636
 Delta, 0, 1.26009, 0.00127668
 Delta, 1, 1.16988, 0.00203805
 Delta, 2, 1.0823, 0.00248746
 Delta, 3, 1.00324, 0.00277846
 Delta, 4, 0.931872, 0.00298804
 Delta, 5, 0.862935, 0.00313688
 Delta, 6, 0.800813, 0.00321048
 Delta, 7, 0.745136, 0.00325251
 Delta, 8, 0.696549, 0.00324712
 Delta, 9, 0.648988, 0.00323495
 Delta, 10, 0.604435, 0.00321175
 Delta, 11, 0.566592, 0.00318165
 Delta, 12, 0.524962, 0.0031222
 Delta, 13, 0.488412, 0.00305025
 Delta, 14, 0.454208, 0.00298178
 Delta, 15, 0.420954, 0.00290667
 Delta, 16, 0.39006, 0.00282624
 Delta, 17, 0.360374, 0.00274247
 Delta, 18, 0.327711, 0.00263971
 Delta, 19, 0.280065, 0.00252801
 vega, 0, -0.000384857 ,0
 vega, 1, -3.52271e-005 ,0
 vega, 2, -7.85158e-006 ,0
 vega, 3, 0.00023008 ,0
 vega, 4, 0.000521306 ,0
 vega, 5, -2.98669e-005 ,0
 vega, 6, 0.000390151 ,0
 vega, 7, 0.00037885 ,0
 vega, 8, 9.31084e-005 ,0
 vega, 9, 0.000183449 ,0
 vega, 10, 0.000344103 ,0
 vega, 11, -8.77287e-006 ,0
 vega, 12, 0.000221929 ,0
 vega, 13, 0.000183133 ,0
 vega, 14, 0.000141979 ,0
 vega, 15, 1.33615e-005 ,0
 vega, 16, 1.10357e-005 ,0
 vega, 17, -8.32643e-005 ,0
 vega, 18, -4.86715e-005 ,0
 vega, 19, 5.30522e-005 ,0
 total Vega, 0.00216703
vega output
 factorwise bumping 1
 doCaps 0
 price estimate, 0.216636
 Delta, 0, 1.26009, 0.00127668
 Delta, 1, 1.16988, 0.00203805
 Delta, 2, 1.0823, 0.00248746
 Delta, 3, 1.00324, 0.00277846
 Delta, 4, 0.931872, 0.00298804
 Delta, 5, 0.862935, 0.00313688
 Delta, 6, 0.800813, 0.00321048
 Delta, 7, 0.745136, 0.00325251
 Delta, 8, 0.696549, 0.00324712
 Delta, 9, 0.648988, 0.00323495
 Delta, 10, 0.604435, 0.00321175
 Delta, 11, 0.566592, 0.00318165
 Delta, 12, 0.524962, 0.0031222
 Delta, 13, 0.488412, 0.00305025
 Delta, 14, 0.454208, 0.00298178
 Delta, 15, 0.420954, 0.00290667
 Delta, 16, 0.39006, 0.00282624
 Delta, 17, 0.360374, 0.00274247
 Delta, 18, 0.327711, 0.00263971
 Delta, 19, 0.280065, 0.00252801
 vega, 0, -9.03408e-005 ,0
 vega, 1, -6.91038e-005 ,0
 vega, 2, -0.000162768 ,0
 vega, 3, -5.13874e-006 ,0
 vega, 4, 0.00022195 ,0
 vega, 5, 0.000127121 ,0
 vega, 6, 0.000161824 ,0
 vega, 7, 0.000160615 ,0
 vega, 8, 0.00012811 ,0
 vega, 9, 0.000121993 ,0
 vega, 10, 0.00027437 ,0
 vega, 11, 0.000150963 ,0
 vega, 12, 6.0907e-005 ,0
 vega, 13, 5.54798e-005 ,0
 vega, 14, 0.000115215 ,0
 vega, 15, 4.66343e-005 ,0
 vega, 16, 7.26397e-005 ,0
 vega, 17, 1.47797e-005 ,0
 vega, 18, 1.92582e-005 ,0
 vega, 19, 4.99696e-005 ,0
 total Vega, 0.00145448
vega output
 factorwise bumping 0
 doCaps 1
 price estimate, 0.216636
 Delta, 0, 1.26009, 0.00127668
 Delta, 1, 1.16988, 0.00203805
 Delta, 2, 1.0823, 0.00248746
 Delta, 3, 1.00324, 0.00277846
 Delta, 4, 0.931872, 0.00298804
 Delta, 5, 0.862935, 0.00313688
 Delta, 6, 0.800813, 0.00321048
 Delta, 7, 0.745136, 0.00325251
 Delta, 8, 0.696549, 0.00324712
 Delta, 9, 0.648988, 0.00323495
 Delta, 10, 0.604435, 0.00321175
 Delta, 11, 0.566592, 0.00318165
 Delta, 12, 0.524962, 0.0031222
 Delta, 13, 0.488412, 0.00305025
 Delta, 14, 0.454208, 0.00298178
 Delta, 15, 0.420954, 0.00290667
 Delta, 16, 0.39006, 0.00282624
 Delta, 17, 0.360374, 0.00274247
 Delta, 18, 0.327711, 0.00263971
 Delta, 19, 0.280065, 0.00252801
 vega, 0, -7.21714e-005 ,0
 vega, 1, 0.000136659 ,0
 vega, 2, 5.62648e-005 ,0
 vega, 3, 0.00025997 ,0
 vega, 4, 0.000553457 ,0
 vega, 5, -0.000175396 ,0
 vega, 6, 0.000423636 ,0
 vega, 7, 0.000613373 ,0
 vega, 8, 0.00011268 ,0
 vega, 9, 0.00021311 ,0
 vega, 10, 0.000596778 ,0
 vega, 11, -2.98108e-005 ,0
 vega, 12, 0.000205846 ,0
 vega, 13, 0.000468935 ,0
 vega, 14, 0.000175547 ,0
 vega, 15, -9.41773e-005 ,0
 vega, 16, -1.65462e-005 ,0
 vega, 17, -6.75764e-005 ,0
 vega, 18, -0.000104451 ,0
 vega, 19, -0.000127399 ,0
 vega, 20, -0.000137515 ,0
 vega, 21, -8.34189e-005 ,0
 vega, 22, -7.87685e-005 ,0
 vega, 23, -0.000125187 ,0
 vega, 24, -0.00010618 ,0
 vega, 25, -9.40511e-005 ,0
 vega, 26, -0.00013306 ,0
 vega, 27, -0.000110321 ,0
 vega, 28, -9.3107e-005 ,0
 vega, 29, -0.000187345 ,0
 vega, 30, -0.000139666 ,0
 vega, 31, -0.000187661 ,0
 vega, 32, -0.000156292 ,0
 vega, 33, -0.00014873 ,0
 vega, 34, -0.00012808 ,0
 total Vega, 0.00121934
vega output
 factorwise bumping 1
 doCaps 1
 price estimate, 0.216636
 Delta, 0, 1.26009, 0.00127668
 Delta, 1, 1.16988, 0.00203805
 Delta, 2, 1.0823, 0.00248746
 Delta, 3, 1.00324, 0.00277846
 Delta, 4, 0.931872, 0.00298804
 Delta, 5, 0.862935, 0.00313688
 Delta, 6, 0.800813, 0.00321048
 Delta, 7, 0.745136, 0.00325251
 Delta, 8, 0.696549, 0.00324712
 Delta, 9, 0.648988, 0.00323495
 Delta, 10, 0.604435, 0.00321175
 Delta, 11, 0.566592, 0.00318165
 Delta, 12, 0.524962, 0.0031222
 Delta, 13, 0.488412, 0.00305025
 Delta, 14, 0.454208, 0.00298178
 Delta, 15, 0.420954, 0.00290667
 Delta, 16, 0.39006, 0.00282624
 Delta, 17, 0.360374, 0.00274247
 Delta, 18, 0.327711, 0.00263971
 Delta, 19, 0.280065, 0.00252801
 vega, 0, -3.69174e-005 ,0
 vega, 1, 0.000129388 ,0
 vega, 2, 6.98429e-005 ,0
 vega, 3, 0.000231552 ,0
 vega, 4, 0.000455463 ,0
 vega, 5, 0.000321583 ,0
 vega, 6, 0.000366656 ,0
 vega, 7, 0.000339349 ,0
 vega, 8, 0.000312691 ,0
 vega, 9, 0.000270936 ,0
 vega, 10, 0.000492036 ,0
 vega, 11, 0.000280992 ,0
 vega, 12, 0.000174691 ,0
 vega, 13, 0.000152782 ,0
 vega, 14, 0.000255612 ,0
 vega, 15, 9.36597e-005 ,0
 vega, 16, 0.000204994 ,0
 vega, 17, -1.45242e-006 ,0
 vega, 18, -4.71563e-005 ,0
 vega, 19, -9.00451e-005 ,0
 vega, 20, -1.77406e-005 ,0
 vega, 21, -6.91377e-005 ,0
 vega, 22, -0.000107325 ,0
 vega, 23, -0.000134943 ,0
 vega, 24, -0.000156467 ,0
 vega, 25, -0.000167919 ,0
 vega, 26, -0.000180652 ,0
 vega, 27, -0.000188117 ,0
 vega, 28, -0.000196438 ,0
 vega, 29, -0.00019889 ,0
 vega, 30, -0.00021336 ,0
 vega, 31, -0.000213246 ,0
 vega, 32, -0.000210818 ,0
 vega, 33, -0.000206102 ,0
 vega, 34, -0.000211008 ,0
 vega, 35, -0.000198566 ,0
 vega, 36, -0.000207652 ,0
 vega, 37, -0.000176331 ,0
 vega, 38, -0.000123168 ,0
 total Vega, 0.000798772
 Upper - lower is, 0.00259873, with standard error 0.000401346
 time to compute upper bound is,  85.595, seconds.
 inverse floater
 fixed strikes :  0.15
 number rates :  20
training paths, 65536
paths, 65536
vega Paths, 16384
 rate level 0.07
0.323454
0.342527
 time to build strategy, 12.779, seconds.
 time to price, 21.509, seconds.
vega output
 factorwise bumping 0
 doCaps 0
 price estimate, 0.34265
 Delta, 0, 0.969376, 0.00297678
 Delta, 1, 0.873762, 0.00300887
 Delta, 2, 0.810786, 0.00293835
 Delta, 3, 0.762095, 0.00285246
 Delta, 4, 0.71986, 0.00277316
 Delta, 5, 0.683966, 0.00271086
 Delta, 6, 0.649749, 0.00263977
 Delta, 7, 0.617911, 0.00257003
 Delta, 8, 0.586519, 0.00251352
 Delta, 9, 0.557197, 0.00244728
 Delta, 10, 0.529481, 0.00239172
 Delta, 11, 0.502225, 0.00234826
 Delta, 12, 0.477742, 0.00229285
 Delta, 13, 0.454561, 0.00225155
 Delta, 14, 0.426553, 0.00219171
 Delta, 15, 0.403822, 0.00213546
 Delta, 16, 0.382686, 0.00209818
 Delta, 17, 0.360938, 0.00205495
 Delta, 18, 0.335242, 0.00201275
 Delta, 19, 0.295622, 0.0019842
 vega, 0, -0.00151791 ,0
 vega, 1, 0.000148919 ,0
 vega, 2, 0.000132579 ,0
 vega, 3, -0.000126394 ,0
 vega, 4, 9.74132e-005 ,0
 vega, 5, -0.000127503 ,0
 vega, 6, 0.000191537 ,0
 vega, 7, -9.87701e-005 ,0
 vega, 8, -9.63463e-005 ,0
 vega, 9, 0.000112571 ,0
 vega, 10, -0.000164674 ,0
 vega, 11, 0.00015804 ,0
 vega, 12, 8.74819e-005 ,0
 vega, 13, 5.75986e-005 ,0
 vega, 14, 9.58877e-005 ,0
 vega, 15, -0.000109122 ,0
 vega, 16, -3.2076e-007 ,0
 vega, 17, -8.38044e-005 ,0
 vega, 18, -6.75425e-005 ,0
 vega, 19, 5.54097e-005 ,0
 total Vega, -0.00125495
vega output
 factorwise bumping 1
 doCaps 0
 price estimate, 0.34265
 Delta, 0, 0.969376, 0.00297678
 Delta, 1, 0.873762, 0.00300887
 Delta, 2, 0.810786, 0.00293835
 Delta, 3, 0.762095, 0.00285246
 Delta, 4, 0.71986, 0.00277316
 Delta, 5, 0.683966, 0.00271086
 Delta, 6, 0.649749, 0.00263977
 Delta, 7, 0.617911, 0.00257003
 Delta, 8, 0.586519, 0.00251352
 Delta, 9, 0.557197, 0.00244728
 Delta, 10, 0.529481, 0.00239172
 Delta, 11, 0.502225, 0.00234826
 Delta, 12, 0.477742, 0.00229285
 Delta, 13, 0.454561, 0.00225155
 Delta, 14, 0.426553, 0.00219171
 Delta, 15, 0.403822, 0.00213546
 Delta, 16, 0.382686, 0.00209818
 Delta, 17, 0.360938, 0.00205495
 Delta, 18, 0.335242, 0.00201275
 Delta, 19, 0.295622, 0.0019842
 vega, 0, -0.000381813 ,0
 vega, 1, -0.000405229 ,0
 vega, 2, -0.000444632 ,0
 vega, 3, -0.000345939 ,0
 vega, 4, -0.000228287 ,0
 vega, 5, -0.000195561 ,0
 vega, 6, -6.20786e-005 ,0
 vega, 7, -0.0001063 ,0
 vega, 8, -2.03691e-005 ,0
 vega, 9, -3.51976e-005 ,0
 vega, 10, -5.77552e-005 ,0
 vega, 11, 0.000120196 ,0
 vega, 12, -8.38198e-006 ,0
 vega, 13, 3.45363e-005 ,0
 vega, 14, 6.17824e-005 ,0
 vega, 15, 1.18413e-005 ,0
 vega, 16, 2.34694e-005 ,0
 vega, 17, -4.50198e-006 ,0
 vega, 18, 2.36878e-005 ,0
 vega, 19, 6.60989e-005 ,0
 total Vega, -0.00195443
vega output
 factorwise bumping 0
 doCaps 1
 price estimate, 0.34265
 Delta, 0, 0.969376, 0.00297678
 Delta, 1, 0.873762, 0.00300887
 Delta, 2, 0.810786, 0.00293835
 Delta, 3, 0.762095, 0.00285246
 Delta, 4, 0.71986, 0.00277316
 Delta, 5, 0.683966, 0.00271086
 Delta, 6, 0.649749, 0.00263977
 Delta, 7, 0.617911, 0.00257003
 Delta, 8, 0.586519, 0.00251352
 Delta, 9, 0.557197, 0.00244728
 Delta, 10, 0.529481, 0.00239172
 Delta, 11, 0.502225, 0.00234826
 Delta, 12, 0.477742, 0.00229285
 Delta, 13, 0.454561, 0.00225155
 Delta, 14, 0.426553, 0.00219171
 Delta, 15, 0.403822, 0.00213546
 Delta, 16, 0.382686, 0.00209818
 Delta, 17, 0.360938, 0.00205495
 Delta, 18, 0.335242, 0.00201275
 Delta, 19, 0.295622, 0.0019842
 vega, 0, -4.21087e-005 ,0
 vega, 1, 3.00695e-005 ,0
 vega, 2, 2.36447e-005 ,0
 vega, 3, -0.000182882 ,0
 vega, 4, 0.000226781 ,0
 vega, 5, -2.36817e-006 ,0
 vega, 6, 0.000457528 ,0
 vega, 7, -7.13437e-006 ,0
 vega, 8, 0.000334121 ,0
 vega, 9, 0.000400273 ,0
 vega, 10, -0.000167116 ,0
 vega, 11, 0.000475872 ,0
 vega, 12, 0.000196944 ,0
 vega, 13, -1.37504e-005 ,0
 vega, 14, 0.00021986 ,0
 vega, 15, -0.000170297 ,0
 vega, 16, -0.000147472 ,0
 vega, 17, -0.000228598 ,0
 vega, 18, -0.000272943 ,0
 vega, 19, -0.000290572 ,0
 vega, 20, -0.000317381 ,0
 vega, 21, -0.000312586 ,0
 vega, 22, -0.000331411 ,0
 vega, 23, -0.000290355 ,0
 vega, 24, -0.00033999 ,0
 vega, 25, -0.000346077 ,0
 vega, 26, -0.000292448 ,0
 vega, 27, -0.000322885 ,0
 vega, 28, -0.000306835 ,0
 vega, 29, -0.000306982 ,0
 vega, 30, -0.000257612 ,0
 vega, 31, -0.000336239 ,0
 vega, 32, -0.000282398 ,0
 vega, 33, -0.000246067 ,0
 vega, 34, -0.000206617 ,0
 total Vega, -0.00365603
vega output
 factorwise bumping 1
 doCaps 1
 price estimate, 0.34265
 Delta, 0, 0.969376, 0.00297678
 Delta, 1, 0.873762, 0.00300887
 Delta, 2, 0.810786, 0.00293835
 Delta, 3, 0.762095, 0.00285246
 Delta, 4, 0.71986, 0.00277316
 Delta, 5, 0.683966, 0.00271086
 Delta, 6, 0.649749, 0.00263977
 Delta, 7, 0.617911, 0.00257003
 Delta, 8, 0.586519, 0.00251352
 Delta, 9, 0.557197, 0.00244728
 Delta, 10, 0.529481, 0.00239172
 Delta, 11, 0.502225, 0.00234826
 Delta, 12, 0.477742, 0.00229285
 Delta, 13, 0.454561, 0.00225155
 Delta, 14, 0.426553, 0.00219171
 Delta, 15, 0.403822, 0.00213546
 Delta, 16, 0.382686, 0.00209818
 Delta, 17, 0.360938, 0.00205495
 Delta, 18, 0.335242, 0.00201275
 Delta, 19, 0.295622, 0.0019842
 vega, 0, -1.08594e-005 ,0
 vega, 1, 3.28259e-005 ,0
 vega, 2, -1.49747e-005 ,0
 vega, 3, 6.20278e-005 ,0
 vega, 4, 0.000141605 ,0
 vega, 5, 0.000121746 ,0
 vega, 6, 0.000272705 ,0
 vega, 7, 0.000161356 ,0
 vega, 8, 0.000242198 ,0
 vega, 9, 0.0002107 ,0
 vega, 10, 0.00011854 ,0
 vega, 11, 0.000360619 ,0
 vega, 12, 0.00014925 ,0
 vega, 13, 0.000191178 ,0
 vega, 14, 0.00024885 ,0
 vega, 15, 0.000145838 ,0
 vega, 16, 0.00011568 ,0
 vega, 17, 4.21121e-006 ,0
 vega, 18, 2.18317e-005 ,0
 vega, 19, -0.000188927 ,0
 vega, 20, -0.000148246 ,0
 vega, 21, -0.000229671 ,0
 vega, 22, -0.000277894 ,0
 vega, 23, -0.000309583 ,0
 vega, 24, -0.000329566 ,0
 vega, 25, -0.000339254 ,0
 vega, 26, -0.000353644 ,0
 vega, 27, -0.000356302 ,0
 vega, 28, -0.000359206 ,0
 vega, 29, -0.000360529 ,0
 vega, 30, -0.000351546 ,0
 vega, 31, -0.00035566 ,0
 vega, 32, -0.000345851 ,0
 vega, 33, -0.00033724 ,0
 vega, 34, -0.000337278 ,0
 vega, 35, -0.000329692 ,0
 vega, 36, -0.000314021 ,0
 vega, 37, -0.00027431 ,0
 vega, 38, -0.000231487 ,0
 total Vega, -0.00355458
 Upper - lower is, 0.000516568, with standard error 0.000132409
 time to compute upper bound is,  93.258, seconds.
 inverse floater
 fixed strikes :  0.15
 number rates :  20
training paths, 65536
paths, 65536
vega Paths, 16384
 rate level 0.08
0.43381
0.442296
 time to build strategy, 12.081, seconds.
 time to price, 19.335, seconds.
vega output
 factorwise bumping 0
 doCaps 0
 price estimate, 0.442225
 Delta, 0, 0.460573, 0.00283912
 Delta, 1, 0.497331, 0.00282374
 Delta, 2, 0.508616, 0.00272413
 Delta, 3, 0.506396, 0.00259853
 Delta, 4, 0.496328, 0.00247277
 Delta, 5, 0.483507, 0.00235078
 Delta, 6, 0.471974, 0.00224921
 Delta, 7, 0.459962, 0.00215125
 Delta, 8, 0.444803, 0.00206655
 Delta, 9, 0.432474, 0.0019875
 Delta, 10, 0.417119, 0.00190449
 Delta, 11, 0.400283, 0.0018285
 Delta, 12, 0.389304, 0.00177295
 Delta, 13, 0.374843, 0.00171107
 Delta, 14, 0.361905, 0.00165603
 Delta, 15, 0.346607, 0.00159712
 Delta, 16, 0.332138, 0.001552
 Delta, 17, 0.318848, 0.00152276
 Delta, 18, 0.304632, 0.00148693
 Delta, 19, 0.279958, 0.00148421
 vega, 0, -0.00159694 ,0
 vega, 1, 0.000136159 ,0
 vega, 2, 0.000157006 ,0
 vega, 3, -3.79828e-005 ,0
 vega, 4, -8.29012e-005 ,0
 vega, 5, -9.53439e-005 ,0
 vega, 6, -0.000226751 ,0
 vega, 7, -0.000273561 ,0
 vega, 8, -6.25763e-005 ,0
 vega, 9, -0.000228828 ,0
 vega, 10, -0.000122139 ,0
 vega, 11, -3.35834e-006 ,0
 vega, 12, -8.21506e-006 ,0
 vega, 13, 3.76315e-005 ,0
 vega, 14, -9.71785e-005 ,0
 vega, 15, -4.08222e-005 ,0
 vega, 16, -3.91734e-005 ,0
 vega, 17, -0.000117918 ,0
 vega, 18, -0.000125125 ,0
 vega, 19, 4.88174e-005 ,0
 total Vega, -0.0027792
vega output
 factorwise bumping 1
 doCaps 0
 price estimate, 0.442225
 Delta, 0, 0.460573, 0.00283912
 Delta, 1, 0.497331, 0.00282374
 Delta, 2, 0.508616, 0.00272413
 Delta, 3, 0.506396, 0.00259853
 Delta, 4, 0.496328, 0.00247277
 Delta, 5, 0.483507, 0.00235078
 Delta, 6, 0.471974, 0.00224921
 Delta, 7, 0.459962, 0.00215125
 Delta, 8, 0.444803, 0.00206655
 Delta, 9, 0.432474, 0.0019875
 Delta, 10, 0.417119, 0.00190449
 Delta, 11, 0.400283, 0.0018285
 Delta, 12, 0.389304, 0.00177295
 Delta, 13, 0.374843, 0.00171107
 Delta, 14, 0.361905, 0.00165603
 Delta, 15, 0.346607, 0.00159712
 Delta, 16, 0.332138, 0.001552
 Delta, 17, 0.318848, 0.00152276
 Delta, 18, 0.304632, 0.00148693
 Delta, 19, 0.279958, 0.00148421
 vega, 0, -0.000398217 ,0
 vega, 1, -0.000503983 ,0
 vega, 2, -0.000433718 ,0
 vega, 3, -0.00041735 ,0
 vega, 4, -0.000394444 ,0
 vega, 5, -0.000343568 ,0
 vega, 6, -0.000203087 ,0
 vega, 7, -0.000253678 ,0
 vega, 8, -0.000105104 ,0
 vega, 9, -0.000179857 ,0
 vega, 10, -0.000128656 ,0
 vega, 11, -1.26837e-005 ,0
 vega, 12, -8.82276e-005 ,0
 vega, 13, -2.8347e-005 ,0
 vega, 14, -6.22754e-005 ,0
 vega, 15, 6.69944e-006 ,0
 vega, 16, -4.2464e-005 ,0
 vega, 17, -1.64335e-005 ,0
 vega, 18, -1.94719e-005 ,0
 vega, 19, 4.86087e-005 ,0
 total Vega, -0.00357626
vega output
 factorwise bumping 0
 doCaps 1
 price estimate, 0.442225
 Delta, 0, 0.460573, 0.00283912
 Delta, 1, 0.497331, 0.00282374
 Delta, 2, 0.508616, 0.00272413
 Delta, 3, 0.506396, 0.00259853
 Delta, 4, 0.496328, 0.00247277
 Delta, 5, 0.483507, 0.00235078
 Delta, 6, 0.471974, 0.00224921
 Delta, 7, 0.459962, 0.00215125
 Delta, 8, 0.444803, 0.00206655
 Delta, 9, 0.432474, 0.0019875
 Delta, 10, 0.417119, 0.00190449
 Delta, 11, 0.400283, 0.0018285
 Delta, 12, 0.389304, 0.00177295
 Delta, 13, 0.374843, 0.00171107
 Delta, 14, 0.361905, 0.00165603
 Delta, 15, 0.346607, 0.00159712
 Delta, 16, 0.332138, 0.001552
 Delta, 17, 0.318848, 0.00152276
 Delta, 18, 0.304632, 0.00148693
 Delta, 19, 0.279958, 0.00148421
 vega, 0, -3.57294e-006 ,0
 vega, 1, -4.20311e-005 ,0
 vega, 2, 5.32395e-005 ,0
 vega, 3, -3.82564e-005 ,0
 vega, 4, 6.01927e-005 ,0
 vega, 5, 7.88937e-005 ,0
 vega, 6, 4.03392e-005 ,0
 vega, 7, -6.90019e-005 ,0
 vega, 8, 0.000296113 ,0
 vega, 9, 6.147e-005 ,0
 vega, 10, 3.59436e-005 ,0
 vega, 11, 0.000211845 ,0
 vega, 12, 0.000233816 ,0
 vega, 13, 0.000270493 ,0
 vega, 14, 9.93468e-005 ,0
 vega, 15, -0.000224188 ,0
 vega, 16, -0.000161354 ,0
 vega, 17, -0.00024208 ,0
 vega, 18, -0.000293824 ,0
 vega, 19, -0.000330228 ,0
 vega, 20, -0.000362651 ,0
 vega, 21, -0.00036908 ,0
 vega, 22, -0.000381055 ,0
 vega, 23, -0.000361797 ,0
 vega, 24, -0.000381614 ,0
 vega, 25, -0.000381987 ,0
 vega, 26, -0.000358666 ,0
 vega, 27, -0.0003594 ,0
 vega, 28, -0.000373214 ,0
 vega, 29, -0.000372637 ,0
 vega, 30, -0.000339783 ,0
 vega, 31, -0.000358079 ,0
 vega, 32, -0.000316225 ,0
 vega, 33, -0.000279363 ,0
 vega, 34, -0.000257126 ,0
 total Vega, -0.00521552
vega output
 factorwise bumping 1
 doCaps 1
 price estimate, 0.442225
 Delta, 0, 0.460573, 0.00283912
 Delta, 1, 0.497331, 0.00282374
 Delta, 2, 0.508616, 0.00272413
 Delta, 3, 0.506396, 0.00259853
 Delta, 4, 0.496328, 0.00247277
 Delta, 5, 0.483507, 0.00235078
 Delta, 6, 0.471974, 0.00224921
 Delta, 7, 0.459962, 0.00215125
 Delta, 8, 0.444803, 0.00206655
 Delta, 9, 0.432474, 0.0019875
 Delta, 10, 0.417119, 0.00190449
 Delta, 11, 0.400283, 0.0018285
 Delta, 12, 0.389304, 0.00177295
 Delta, 13, 0.374843, 0.00171107
 Delta, 14, 0.361905, 0.00165603
 Delta, 15, 0.346607, 0.00159712
 Delta, 16, 0.332138, 0.001552
 Delta, 17, 0.318848, 0.00152276
 Delta, 18, 0.304632, 0.00148693
 Delta, 19, 0.279958, 0.00148421
 vega, 0, 1.07662e-005 ,0
 vega, 1, -4.76854e-005 ,0
 vega, 2, 4.45414e-005 ,0
 vega, 3, 3.83918e-005 ,0
 vega, 4, 1.5429e-005 ,0
 vega, 5, 1.42451e-005 ,0
 vega, 6, 0.00016313 ,0
 vega, 7, 5.55873e-005 ,0
 vega, 8, 0.000188954 ,0
 vega, 9, 7.5709e-005 ,0
 vega, 10, 9.97703e-005 ,0
 vega, 11, 0.000235537 ,0
 vega, 12, 9.99334e-005 ,0
 vega, 13, 0.000194768 ,0
 vega, 14, 8.93619e-005 ,0
 vega, 15, 0.000203512 ,0
 vega, 16, 1.81428e-005 ,0
 vega, 17, 5.97403e-005 ,0
 vega, 18, 3.41968e-006 ,0
 vega, 19, -0.000256639 ,0
 vega, 20, -0.000162996 ,0
 vega, 21, -0.000245118 ,0
 vega, 22, -0.000302819 ,0
 vega, 23, -0.000341443 ,0
 vega, 24, -0.000365459 ,0
 vega, 25, -0.000378764 ,0
 vega, 26, -0.000394877 ,0
 vega, 27, -0.000400764 ,0
 vega, 28, -0.000404833 ,0
 vega, 29, -0.000403374 ,0
 vega, 30, -0.00039906 ,0
 vega, 31, -0.000400152 ,0
 vega, 32, -0.000391187 ,0
 vega, 33, -0.000390598 ,0
 vega, 34, -0.000378079 ,0
 vega, 35, -0.000380115 ,0
 vega, 36, -0.000350165 ,0
 vega, 37, -0.000325744 ,0
 vega, 38, -0.000285695 ,0
 total Vega, -0.00539463
 Upper - lower is, 0.000252942, with standard error 8.50214e-005
 time to compute upper bound is,  97.575, seconds.
 inverse floater
 fixed strikes :  0.15
 number rates :  20
training paths, 65536
paths, 65536
vega Paths, 16384
 rate level 0.09
0.510945
0.514723
 time to build strategy, 12.071, seconds.
 time to price, 19.094, seconds.
vega output
 factorwise bumping 0
 doCaps 0
 price estimate, 0.514711
 Delta, 0, 0.229676, 0.001063
 Delta, 1, 0.274306, 0.00162927
 Delta, 2, 0.30378, 0.00183364
 Delta, 3, 0.322475, 0.00189356
 Delta, 4, 0.331584, 0.00187659
 Delta, 5, 0.335404, 0.00182654
 Delta, 6, 0.336513, 0.00177115
 Delta, 7, 0.333858, 0.00169962
 Delta, 8, 0.331342, 0.00164102
 Delta, 9, 0.326109, 0.00157015
 Delta, 10, 0.321658, 0.00150764
 Delta, 11, 0.314438, 0.00144099
 Delta, 12, 0.306646, 0.00138098
 Delta, 13, 0.299191, 0.00131957
 Delta, 14, 0.293588, 0.00127327
 Delta, 15, 0.287061, 0.00122609
 Delta, 16, 0.279314, 0.00118218
 Delta, 17, 0.268988, 0.00114027
 Delta, 18, 0.263255, 0.00109395
 Delta, 19, 0.253101, 0.00107555
 vega, 0, -0.000553764 ,0
 vega, 1, -0.000313659 ,0
 vega, 2, -7.74467e-005 ,0
 vega, 3, -7.31924e-005 ,0
 vega, 4, -0.000183027 ,0
 vega, 5, -7.11524e-005 ,0
 vega, 6, -0.000320414 ,0
 vega, 7, -0.000191643 ,0
 vega, 8, -0.000179688 ,0
 vega, 9, -0.000188523 ,0
 vega, 10, -0.000262632 ,0
 vega, 11, -0.000104735 ,0
 vega, 12, -3.67112e-005 ,0
 vega, 13, 5.0801e-005 ,0
 vega, 14, -7.67124e-005 ,0
 vega, 15, -7.93589e-005 ,0
 vega, 16, -8.17007e-005 ,0
 vega, 17, -0.000139193 ,0
 vega, 18, -0.000148013 ,0
 vega, 19, -5.69882e-006 ,0
 total Vega, -0.00303646
vega output
 factorwise bumping 1
 doCaps 0
 price estimate, 0.514711
 Delta, 0, 0.229676, 0.001063
 Delta, 1, 0.274306, 0.00162927
 Delta, 2, 0.30378, 0.00183364
 Delta, 3, 0.322475, 0.00189356
 Delta, 4, 0.331584, 0.00187659
 Delta, 5, 0.335404, 0.00182654
 Delta, 6, 0.336513, 0.00177115
 Delta, 7, 0.333858, 0.00169962
 Delta, 8, 0.331342, 0.00164102
 Delta, 9, 0.326109, 0.00157015
 Delta, 10, 0.321658, 0.00150764
 Delta, 11, 0.314438, 0.00144099
 Delta, 12, 0.306646, 0.00138098
 Delta, 13, 0.299191, 0.00131957
 Delta, 14, 0.293588, 0.00127327
 Delta, 15, 0.287061, 0.00122609
 Delta, 16, 0.279314, 0.00118218
 Delta, 17, 0.268988, 0.00114027
 Delta, 18, 0.263255, 0.00109395
 Delta, 19, 0.253101, 0.00107555
 vega, 0, -9.56784e-005 ,0
 vega, 1, -0.000349316 ,0
 vega, 2, -0.000368785 ,0
 vega, 3, -0.000392395 ,0
 vega, 4, -0.000416583 ,0
 vega, 5, -0.00038777 ,0
 vega, 6, -0.000283443 ,0
 vega, 7, -0.000292427 ,0
 vega, 8, -0.000225062 ,0
 vega, 9, -0.000172927 ,0
 vega, 10, -0.000200831 ,0
 vega, 11, -9.84221e-005 ,0
 vega, 12, -8.84595e-005 ,0
 vega, 13, -6.60413e-005 ,0
 vega, 14, -0.000103 ,0
 vega, 15, -6.94627e-005 ,0
 vega, 16, -5.59954e-005 ,0
 vega, 17, -2.0873e-005 ,0
 vega, 18, -6.98918e-005 ,0
 vega, 19, -1.7545e-006 ,0
 total Vega, -0.00375912
vega output
 factorwise bumping 0
 doCaps 1
 price estimate, 0.514711
 Delta, 0, 0.229676, 0.001063
 Delta, 1, 0.274306, 0.00162927
 Delta, 2, 0.30378, 0.00183364
 Delta, 3, 0.322475, 0.00189356
 Delta, 4, 0.331584, 0.00187659
 Delta, 5, 0.335404, 0.00182654
 Delta, 6, 0.336513, 0.00177115
 Delta, 7, 0.333858, 0.00169962
 Delta, 8, 0.331342, 0.00164102
 Delta, 9, 0.326109, 0.00157015
 Delta, 10, 0.321658, 0.00150764
 Delta, 11, 0.314438, 0.00144099
 Delta, 12, 0.306646, 0.00138098
 Delta, 13, 0.299191, 0.00131957
 Delta, 14, 0.293588, 0.00127327
 Delta, 15, 0.287061, 0.00122609
 Delta, 16, 0.279314, 0.00118218
 Delta, 17, 0.268988, 0.00114027
 Delta, 18, 0.263255, 0.00109395
 Delta, 19, 0.253101, 0.00107555
 vega, 0, 2.94452e-005 ,0
 vega, 1, -7.00698e-005 ,0
 vega, 2, 5.31718e-005 ,0
 vega, 3, 2.2747e-005 ,0
 vega, 4, -1.53564e-005 ,0
 vega, 5, 8.88767e-005 ,0
 vega, 6, -0.000126364 ,0
 vega, 7, 2.06188e-005 ,0
 vega, 8, 0.000160274 ,0
 vega, 9, 0.000167783 ,0
 vega, 10, -0.000177057 ,0
 vega, 11, 1.47564e-005 ,0
 vega, 12, 0.000243835 ,0
 vega, 13, 0.000153604 ,0
 vega, 14, 0.000211906 ,0
 vega, 15, -0.000305443 ,0
 vega, 16, -3.49366e-005 ,0
 vega, 17, -0.000112531 ,0
 vega, 18, -0.000180932 ,0
 vega, 19, -0.000236119 ,0
 vega, 20, -0.000291275 ,0
 vega, 21, -0.000318101 ,0
 vega, 22, -0.000331099 ,0
 vega, 23, -0.000332397 ,0
 vega, 24, -0.000358864 ,0
 vega, 25, -0.000382323 ,0
 vega, 26, -0.000343456 ,0
 vega, 27, -0.000325816 ,0
 vega, 28, -0.000356584 ,0
 vega, 29, -0.000354673 ,0
 vega, 30, -0.000333586 ,0
 vega, 31, -0.000377143 ,0
 vega, 32, -0.000344616 ,0
 vega, 33, -0.000308718 ,0
 vega, 34, -0.00028993 ,0
 total Vega, -0.00514037
vega output
 factorwise bumping 1
 doCaps 1
 price estimate, 0.514711
 Delta, 0, 0.229676, 0.001063
 Delta, 1, 0.274306, 0.00162927
 Delta, 2, 0.30378, 0.00183364
 Delta, 3, 0.322475, 0.00189356
 Delta, 4, 0.331584, 0.00187659
 Delta, 5, 0.335404, 0.00182654
 Delta, 6, 0.336513, 0.00177115
 Delta, 7, 0.333858, 0.00169962
 Delta, 8, 0.331342, 0.00164102
 Delta, 9, 0.326109, 0.00157015
 Delta, 10, 0.321658, 0.00150764
 Delta, 11, 0.314438, 0.00144099
 Delta, 12, 0.306646, 0.00138098
 Delta, 13, 0.299191, 0.00131957
 Delta, 14, 0.293588, 0.00127327
 Delta, 15, 0.287061, 0.00122609
 Delta, 16, 0.279314, 0.00118218
 Delta, 17, 0.268988, 0.00114027
 Delta, 18, 0.263255, 0.00109395
 Delta, 19, 0.253101, 0.00107555
 vega, 0, 7.98415e-006 ,0
 vega, 1, -2.4354e-005 ,0
 vega, 2, 3.70234e-005 ,0
 vega, 3, 3.92433e-005 ,0
 vega, 4, -1.83597e-005 ,0
 vega, 5, -2.70327e-005 ,0
 vega, 6, 7.08649e-005 ,0
 vega, 7, -7.11253e-006 ,0
 vega, 8, 6.39676e-005 ,0
 vega, 9, 9.43271e-005 ,0
 vega, 10, 2.82271e-005 ,0
 vega, 11, 0.000131976 ,0
 vega, 12, 9.74938e-005 ,0
 vega, 13, 0.000161235 ,0
 vega, 14, 6.30819e-005 ,0
 vega, 15, 0.000104268 ,0
 vega, 16, 5.25182e-005 ,0
 vega, 17, 0.00010306 ,0
 vega, 18, 1.90082e-005 ,0
 vega, 19, -0.000340687 ,0
 vega, 20, -3.52881e-005 ,0
 vega, 21, -0.000117964 ,0
 vega, 22, -0.000188503 ,0
 vega, 23, -0.000245255 ,0
 vega, 24, -0.000284163 ,0
 vega, 25, -0.000311209 ,0
 vega, 26, -0.000335292 ,0
 vega, 27, -0.000345112 ,0
 vega, 28, -0.000355703 ,0
 vega, 29, -0.000362711 ,0
 vega, 30, -0.000363717 ,0
 vega, 31, -0.000366123 ,0
 vega, 32, -0.00036084 ,0
 vega, 33, -0.000365133 ,0
 vega, 34, -0.000358883 ,0
 vega, 35, -0.000358315 ,0
 vega, 36, -0.000343427 ,0
 vega, 37, -0.00033602 ,0
 vega, 38, -0.000324417 ,0
 total Vega, -0.00510134
 Upper - lower is, 0.000176731, with standard error 6.68822e-005
 time to compute upper bound is,  100.103, seconds.

```

### Multi-dim Integral

```
--------------
Exact: 2.6303
Quad: 2.6303
Grid: 2.6303

Seconds for Quad: 0.0020
Seconds for Grid: 0.1270
```

### Replication

```
===========================================================================
Initial market conditions
===========================================================================
Option                                       NPV            Error
---------------------------------------------------------------------------
Original barrier option                      4.260726       N/A
Replicating portfolio (12 dates)             4.322358       0.061632
Replicating portfolio (26 dates)             4.295464       0.034738
Replicating portfolio (52 dates)             4.280909       0.020183
===========================================================================
Modified market conditions: out of the money
===========================================================================
Option                                       NPV            Error
---------------------------------------------------------------------------
Original barrier option                      2.513058       N/A
Replicating portfolio (12 dates)             2.539365       0.026307
Replicating portfolio (26 dates)             2.528362       0.015304
Replicating portfolio (52 dates)             2.522105       0.009047
===========================================================================
Modified market conditions: in the money
===========================================================================
Option                                       NPV            Error
---------------------------------------------------------------------------
Original barrier option                      5.739125       N/A
Replicating portfolio (12 dates)             5.851239       0.112114
Replicating portfolio (26 dates)             5.799867       0.060742
Replicating portfolio (52 dates)             5.773678       0.034553
===========================================================================

The replication seems to be less robust when volatility and
risk-free rate are changed. Feel free to experiment with
the example and contribute a patch if you spot any errors.

Run completed in 0 s
```

### Repo

```
Underlying bond clean price: 89.9769
Underlying bond dirty price: 93.288
Underlying bond accrued at settlement: 3.31111
Underlying bond accrued at delivery:   3.33333
Underlying bond spot income: 3.9834
Underlying bond fwd income:  4.08465
Repo strike: 91.5745
Repo NPV:    -2.8066e-005
Repo clean forward price: 88.2411
Repo dirty forward price: 91.5745
Repo implied yield: 5.000063 % Actual/360 simple compounding
Market repo rate:   5.000000 % Actual/360 simple compounding

Compare with example given at
http://www.fincad.com/support/developerFunc/mathref/BFWD.htm
Clean forward price = 88.2408

In that example, it is unknown what bond calendar they are
using, as well as settlement Days. For that reason, I have
made the simplest possible assumptions here: NullCalendar
and 0 settlement days.

Run completed in 0 s

```

### Swap valuation

```
Today: Monday, September 20th, 2004
Settlement date: Wednesday, September 22nd, 2004
====================================================================
5-year market swap-rate = 4.43 %
====================================================================
        5-years swap paying 4.00 %
term structure | net present value | fair spread | fair fixed rate |
--------------------------------------------------------------------
     depo-swap |          19065.88 |     -0.42 % |          4.43 % |
 depo-fut-swap |          19076.14 |     -0.42 % |          4.43 % |
 depo-FRA-swap |          19056.02 |     -0.42 % |          4.43 % |
--------------------------------------------------------------------
        5-years, 1-year forward swap paying 4.00 %
term structure | net present value | fair spread | fair fixed rate |
--------------------------------------------------------------------
     depo-swap |          40049.46 |     -0.92 % |          4.95 % |
 depo-fut-swap |          40092.79 |     -0.92 % |          4.95 % |
 depo-FRA-swap |          37238.92 |     -0.86 % |          4.88 % |
====================================================================
5-year market swap-rate = 4.60 %
====================================================================
        5-years swap paying 4.00 %
term structure | net present value | fair spread | fair fixed rate |
--------------------------------------------------------------------
     depo-swap |          26539.06 |     -0.58 % |          4.60 % |
 depo-fut-swap |          26553.34 |     -0.58 % |          4.60 % |
 depo-FRA-swap |          26525.34 |     -0.58 % |          4.60 % |
--------------------------------------------------------------------
        5-years, 1-year forward swap paying 4.00 %
term structure | net present value | fair spread | fair fixed rate |
--------------------------------------------------------------------
     depo-swap |          45736.04 |     -1.06 % |          5.09 % |
 depo-fut-swap |          45782.40 |     -1.06 % |          5.09 % |
 depo-FRA-swap |          42922.60 |     -0.99 % |          5.02 % |

Run completed in 2 s
```
