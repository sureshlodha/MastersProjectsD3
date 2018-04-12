from selenium import webdriver
import time
import pandas as pd
from collections import OrderedDict
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import WebDriverException
import csv
from collections import defaultdict
from selenium.webdriver.common.keys import Keys


d = webdriver.Chrome('')
email = ""
password = ""

start_url = "https://www.linkedin.com/mynetwork/invite-connect/connections/"
first_degree_connection_page = "https://www.linkedin.com/mynetwork/invite-connect/connections/"

def linkedin_login(email, password):
    d.get('https://www.linkedin.com/nhome')
    d.find_elements_by_xpath("//input[@name='session_key']")[0].send_keys(email)
    d.find_elements_by_xpath("//input[@name='session_password']")[0].send_keys(password)
    d.find_element_by_id("login-submit").click()
    time.sleep(2)
    d.get('https://www.linkedin.com/sales?trk=d_flagship3_nav')
    time.sleep(5)
    print("Connected")

def get_second_degree_company_and_image():
    csv_file = open('first_degree_related_connect.csv', 'r')
    reader = csv.reader(csv_file)
    count = 0
    for line in reader:
        if count < 9:
            count += 1
            continue
        name = (str)(line[0])
        related_name = (str)(line[1])
        get_each_second_connection_details(name, related_name)
    return


def get_each_second_connection_details_in_sales_navigator_by_second_name(connection_name, related_name):
    search_page = "https://www.linkedin.com/sales?trk=d_flagship3_nav"
    name = connection_name
    d.get(search_page)
    d.find_elements_by_xpath("//input[@name='keywords']")[0].send_keys(name)
    d.find_elements_by_xpath("//input[@name='keywords']")[0].send_keys(Keys.ENTER)
    move_bar()
    try:
        info_containers = d.find_elements_by_class_name("content-wrapper")
    except NoSuchElementException:
        print ("There's no result found for this connection!")
        return
    if len(info_containers) < 1:
        print ("Empty container found, there's no result found for this connection")
        return
    try:
        company = info_containers[0].find_element_by_class_name('company-name').text
    except NoSuchElementException:
        company = "N/A"
    try:
        image_url = info_containers[0].find_element_by_class_name('entity-image').get_attribute('src')
    except NoSuchElementException:
        image_url = "http://www.spring.org.uk/images/question_mark_leader.jpg"
    print (name)
    print (company)
    print (related_name)
    print (image_url)
    details_container = []
    details_container.append(name)
    details_container.append(company)
    details_container.append(related_name)
    details_container.append(image_url)
    write_full_second_degree_info(details_container)


def scrape_by_first_connect_name_in_sales_navi():
    csv_file = open('first_degree_connection_names.csv', 'r')
    reader = csv.reader(csv_file)
    count = 0
    for line in reader:
        if count < 219:
            count += 1
            continue
        name = (str)(line[0])
        find_first_connection_page(name)
    return

def find_first_connection_page(connection_name):
    search_page = "https://www.linkedin.com/sales?trk=d_flagship3_nav"
    name = connection_name
    d.get(search_page)
    d.find_elements_by_xpath("//input[@name='keywords']")[0].send_keys(name)
    d.find_elements_by_xpath("//input[@name='keywords']")[0].send_keys(Keys.ENTER)
    move_bar()
    try:
        d.find_elements_by_class_name("name-link")[0].send_keys(Keys.ENTER)
    except NoSuchElementException:
        print ("Cannot find any result for this connection, check your input or search limitation")
        return
    time.sleep(2)
    slightly_move_bar()
    # d.find_element_by_class_name("connections-badge").send_keys(Keys.ENTER)
    d.find_element_by_class_name("see-all-link").send_keys(Keys.ENTER)
    time.sleep(2)
    page = 1
    get_each_second_details(connection_name, page)


def get_each_second_details(connection_name, page):
    for i in range(0, 5):
        d.execute_script("window.scrollBy(0,1000)")
        time.sleep(2)
        print ("new method scroll down!")


    try:
        info_containers = d.find_elements_by_class_name("content-wrapper")
    except NoSuchElementException:
        print ("There's no result found for this connection!")
        return
    if len(info_containers) < 1:
        print ("Empty container found, there's no result found for this connection")
        return

    for i in info_containers:
        try:
            second_name = i.find_element_by_class_name("name").text
        except NoSuchElementException:
            print ("No result found, check searching limitation")
            continue
        try:
            company = i.find_element_by_class_name('company-name').text
        except NoSuchElementException:
            company = "N/A"
        try:
            image_url = i.find_element_by_class_name('entity-image').get_attribute('src')
        except NoSuchElementException:
            image_url = "http://www.spring.org.uk/images/question_mark_leader.jpg"
        print (second_name)
        print (company)
        print (connection_name)
        print (image_url)
        details_container = []
        details_container.append(second_name)
        details_container.append(company)
        details_container.append(connection_name)
        details_container.append(image_url)
        write_under_full_second(details_container)

    time.sleep(2)

    flag = move_pages(page)

    if flag is "end" or page >= 4:
        return
    else:
        page += 1
        get_each_second_details(connection_name, page)



def write_full_second_degree_info(relation_container):
    csv_file = open("full_second_degree_connect_details.csv", "a")
    writer = csv.writer(csv_file)
    writer.writerow(relation_container)

def write_under_full_second(relation_container):
    csv_file = open("full_second_two.csv", "a")
    writer = csv.writer(csv_file)
    writer.writerow(relation_container)

def move_bar():
    js="var q=document.documentElement.scrollTop=200000"
    d.execute_script(js)
    print ("the bar has been moved down")
    time.sleep(1)

def slightly_move_bar():
    js="var q=document.documentElement.scrollTop=1000"
    d.execute_script(js)
    print ("scroll down!")
    time.sleep(1)



def move_pages(page):
    try:
        container = d.find_elements_by_class_name("page-link")
        if page > len(container) - 1:
            return "end"
    except NoSuchElementException:
        return "end"

    try:
        d.find_elements_by_class_name("page-link")[page]
    except NoSuchElementException:
        print("Already in the next final page, no more profile data for this person's connection")
        return "end"

    try:
        d.find_elements_by_class_name("page-link")[page].click()
    except WebDriverException:
        print ("No element, probably in the last page")
        return "end"



if __name__ == "__main__":
    linkedin_login(email, password)
    #get_second_degree_company_and_image()
    scrape_by_first_connect_name_in_sales_navi()

    print ("finished")
