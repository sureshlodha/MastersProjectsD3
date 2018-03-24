import ast
import csv
import json
import os
import random
import sys

DATA_DIR = os.path.join("data")
DATA_FILE = "walkable-distance-public-transit-2008-2012.csv"

def get_counties(file):
	with open(os.path.join(DATA_DIR, file)) as in_file:
		data = [ast.literal_eval(row)["id"] for row in in_file.read().split("\n")[:-1]]
		return data

def parse_data(data_file, ALL_COUNTIES, ethnicity):
	with open(os.path.join(DATA_DIR, DATA_FILE)) as in_file:
		reader = csv.DictReader(in_file, delimiter=",")
		data = [["percentage", "id"]]
		COUNTIES_ENCOUNTERED = []
		for row in reader:
			if row['race_eth_name'] == ethnicity:
				if row['region_name']=="Bay Area" and len(row['geotypevalue']) >= 7: #and not row['geotypevalue'].endswith("00"):
					# print row['geotypevalue'], row["p_trans_acc"]
					data += [[str(row['p_trans_acc']), "060" + str(row['geotypevalue']).lstrip('0')]]
					COUNTIES_ENCOUNTERED.append("060" + str(row['geotypevalue']).lstrip('0'))

		COUNTIES_NOT_ENCOUNTERED = list(set(ALL_COUNTIES) - set(COUNTIES_ENCOUNTERED))
		for county in COUNTIES_NOT_ENCOUNTERED:
			data += [["0", county]]

		json_data = json.dumps(data)
		with open(os.path.join(DATA_DIR, ethnicity + ".json"), "w") as out_file:
			out_file.write(json_data)


def main():
	ALL_COUNTIES = get_counties("ca-albers-id.ndjson")
	# parse_data(DATA_FILE, ALL_COUNTIES, ethnicity="Asian")
	# parse_data(DATA_FILE, ALL_COUNTIES, ethnicity="AfricanAm")
	# parse_data(DATA_FILE, ALL_COUNTIES, ethnicity="Latino")
	parse_data(DATA_FILE, ALL_COUNTIES, ethnicity="White")
	# parse_data(DATA_FILE, ALL_COUNTIES, ethnicity="Total")

if __name__ == '__main__':
	main()