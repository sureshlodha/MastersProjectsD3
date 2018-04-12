# get bar data

import os
import csv
import json
import sys


# ------ The following codes turn several csv to a json file ---- #
def csvToJson():
    outputJson = {}
    for filename in os.listdir("./PermComByStates/"):
        with open('./PermComByStates/' + filename, 'rb') as csvfile:
            stateComData = list(csv.reader(csvfile))
            stateAbbr = filename[:-4]
            outputJson[stateAbbr] = []
            for eachRow in stateComData[1:]:
                outputJson[stateAbbr].append({"company": eachRow[0].encode("utf8"), "workerCount": eachRow[1]})

    with open('barData.json', 'w') as f:
        json.dump(outputJson, f)


# ------ The following codes turn original csv to simplified( only top 20 PERM companies for each state) ---- #
def top20perm():
    for filename in os.listdir("./PermComByStates_original/"):
        with open('./PermComByStates_original/' + filename, 'rb') as csvfile:
            reader = csv.reader(x.replace('\0', '') for x in csvfile)
            company_data = list(reader)
            company_data.pop(0)  # delete the title row
            company_data.sort(key=lambda x: int(x[1]), reverse=True)
            if filename != 'WY.csv':
                company_data = company_data[:15]  # truncate to 15 companies
            company_data.sort(key=lambda x: int(x[1]), reverse=False)  # reverse sort the 15 companies
            dup = 'a'   # to void duplicate abbreviated company name, append something after dup name
            for eachRow in company_data:
                newVal = eachRow[0].split()[0]
                if newVal in [row[0] for row in company_data]:
                    newVal += dup
                    dup += 'a'
                eachRow[0] = newVal  # truncate each company name to its first word
            title_row = ["Company", "new_foreign_worker_count"]
            company_data.insert(0, title_row)  # put back the title row

        with open('./PermComByStates/' + filename, 'wb') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows(company_data)


# ------ The following codes turn original csv to simplified( only top 20 H1B companies for each state) ---- #
def top20h1b():
    for filename in os.listdir("./H1BComByStates_original/"):
        with open('./H1BComByStates_original/' + filename, 'rb') as csvfile:
            reader = csv.reader(x.replace('\0', '') for x in csvfile)
            company_data = list(reader)
            company_data.pop(0)  # delete the title row
            company_data.sort(key=lambda x: int(x[1]), reverse=True)
            company_data = company_data[:15]  # truncate to 15 companies
            company_data.sort(key=lambda x: int(x[1]), reverse=False)  # reverse sort the 15 companies
            dup = 'a'   # to void duplicate abbreviated company name, append something after dup name
            for eachRow in company_data:
                newVal = eachRow[0].split()[0]
                if newVal in [row[0] for row in company_data]:
                    newVal += dup
                    dup += 'a'
                eachRow[0] = newVal  # truncate each company name to its first word
            title_row = ["Company", "new_foreign_worker_count"]
            company_data.insert(0, title_row)  # put back the title row

        with open('./H1BComByStates/' + filename, 'wb') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows(company_data)


# ------- Main program -------- #
if len(sys.argv) > 1:
    if sys.argv[1] == 'toJson':
        csvToJson()
    elif sys.argv[1] == 'top20perm':
        top20perm()
    elif sys.argv[1] == 'top20h1b':
        top20h1b()
