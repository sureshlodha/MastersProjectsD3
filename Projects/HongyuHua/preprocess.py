import csv

company_csv_files = ['Netflix.csv', 'Amazon.csv', 'Apple.csv', 'Facebook.csv', 'Microsoft.csv', 'eBay.csv', 'Uber.csv', 'Airbnb.csv', 'LinkedIn.csv', 'Walmart.csv']

def preprocess():
    for company_file in company_csv_files:
        related_names = [];
        #read the related connection name from the second connections
        netflix_file_r = open(company_file, 'r')
        reader = csv.reader(netflix_file_r)
        for line in reader:
            related_name = (str)(line[4])
            related_names.append(related_name)
            print (related_name)

        #find teh related connection names in our first-degree dataset
        #write these connections into the netflix dataset
        netflix_file_a = open(company_file, 'a')
        writer = csv.writer(netflix_file_a)

        first_degree_file = open('FirstDegree.csv', 'r')
        reader = csv.reader(first_degree_file)
        for line in reader:
            if (str)(line[1]) in related_names:
                writer.writerow(line)
            
if __name__ == '__main__':
    preprocess();
