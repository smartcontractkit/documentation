#!/bin/bash

var="rgottleber, RyanRHall, scmurphy96, DSergiu, ShadowySuperCryptoCoder, solangegueiros, stvndf, timkaebisch, tippi-fifestarr, chainchad, ekamkohli, sreeharshar84, izcoser, preginald, stone4419, tkaraivanov, ubinatus, udaiveerS"


set -f
arr=(${var//,/ })

for i in "${!arr[@]}"
do
    echo "${arr[i]}"
    yarn all-contributors add "${arr[i]}"  doc
done
