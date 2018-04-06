# QuantLib TypeScript Examples

### [FRA example](https://quantlibjs.github.io/examples)

>
> check browser console to see output
>


output from official source code build (32-bit, debug mode)

```sh
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
