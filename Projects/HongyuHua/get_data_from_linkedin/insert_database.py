# coding: utf-8
import csv
import sys, os
import MySQLdb

def write_full_first_connection_info_to_database():

    conn = MySQLdb.connect(database="LinkedInDatabase", \
                           user="", \
                           password="",\
                            host="127.0.0.1",\
                             port=3306)
    cur = conn.cursor()

    csv_file = open('full_first_degree_connect_info.csv', 'r')
    reader = csv.reader(csv_file)
    for line in reader:
        name = (str)(line[0])
        company = (str)(line[1])
        image_url = (str)(line[2])
        related_name = "Hongyu Hua"
        insert_sql = """
                    INSERT INTO FirstDegree(Name, Degree, Company, RelatedConnectionName, ImageURL)
                    ValUES (%s, %s, %s, %s, %s)
                    """
        cur.execute(insert_sql, (name.encode('utf-8'), 1, company.encode('utf-8'), related_name.encode('utf-8'), image_url))
    conn.commit()
    cur.close()
    csv_file.close()
    conn.close()

def write_full_second_connection_info_to_database():

    conn = MySQLdb.connect(database="LinkedInDatabase", \
                           user="", \
                           password="",\
                            host="127.0.0.1",\
                             port=3306)
    cur = conn.cursor()

    csv_file = open('full_second_two.csv', 'r')
    reader = csv.reader(csv_file)
    for line in reader:
        name = (str)(line[0])
        company = (str)(line[1])
        related_connection_name = (str)(line[2])
        if len(line) <= 3:
            image_url = "N/A"
        else:
            image_url = (str)(line[3])
        insert_sql = """
                    INSERT INTO SecondDegree(Name, Company, Degree, ImageURL, RelatedConnectionName)
                    ValUES (%s, %s, %s, %s, %s)
                    """
        cur.execute(insert_sql, (name.encode('utf-8'), company.encode('utf-8'), 2, image_url.encode('utf-8'), related_connection_name.encode('utf-8')))
    conn.commit()
    cur.close()
    csv_file.close()
    conn.close()


if __name__ == "__main__":
    write_full_first_connection_info_to_database()
    write_full_second_connection_info_to_database()
    print ("finished")
