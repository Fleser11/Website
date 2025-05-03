/* 
MA3740 Final Project

Connor Fleser, Steve Forgrave, Dallas Grandy

An Investigation into Handwriting Speeds: 
An Analysis of Dominant and Non-Dominant Hands Utilizing 
Varied Sentence Structures
*/

* Importing the data;
proc import datafile = '~/data/MA3740.data.collection.long.csv'
	out = speeds dbms = csv;

* Performaning the Summary Statistic;
proc means data = speeds mean std min max median;
	var time;
	class hand case;

* Mixed Model and Associated Plots;
proc mixed data = speeds alpha = .05 plots= all;
	class hand case id;
	model time = hand*case ;
	lsmeans hand*case/ pdiff cl adjust = Tukey;
	random id;
	store out = model;