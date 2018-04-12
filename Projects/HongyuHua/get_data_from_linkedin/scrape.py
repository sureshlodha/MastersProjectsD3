from selenium import webdriver
import time
import pandas as pd
from collections import OrderedDict
from selenium.common.exceptions import NoSuchElementException
import csv
from collections import defaultdict
from selenium.webdriver.common.keys import Keys

#where your driver should be
d = webdriver.Chrome()
first_degree_profile_dict = [[]]
second_degree_profile_dict = [[]]

#your LinkedIn account
email=""
password=""

start_url = "https://www.linkedin.com/mynetwork/invite-connect/connections/"
first_degree_connection_page = "https://www.linkedin.com/mynetwork/invite-connect/connections/"

def linkedin_login(email, password):
    d.get('https://www.linkedin.com/nhome')
    d.find_elements_by_xpath("//input[@name='session_key']")[0].send_keys(email)
    d.find_elements_by_xpath("//input[@name='session_password']")[0].send_keys(password)
    d.find_element_by_id("login-submit").click()
    time.sleep(2)
    print("Connected")

#scrape the name first
def get_first_degree_connections_name():
    d.get(first_degree_connection_page)

    for i in range(0, 8):
        move_bar()

    name_list = []
    results = d.find_elements_by_class_name("connection-card")

    for i in results:
        connection_name = i.find_element_by_class_name("mn-person-info__name").text
        name_list.append(connection_name)
        print (connection_name)
        break

    dataFrame = pd.DataFrame(name_list)
    dataFrame.to_csv("first_degree_connection_names.csv", index=False, sep=',')


def get_first_degree_company_and_image_and_related_connections():
    csv_file = open('first_degree_connection_names.csv', 'r')
    reader = csv.reader(csv_file)
    count_line = 0
    for line in reader:
        if count_line < 9:
            count_line += 1
            continue
        name = (str)(line[0])
        get_each_first_connection_details(name)
        time.sleep(5)
        print ("we have to wait")

    # dataFrame = pd.DataFrame(first_degree_profile_dict)
    # dataFrame.to_csv("full_first_degree_connect_info.csv", index=False, sep=',')
    #
    # dataFrame_two = pd.DataFrame(second_degree_profile_dict)
    # dataFrame_two.to_csv("second_degree_connection_names.csv", index=False, sep=',')



def get_each_first_connection_details(connection_name):
    search_page = "https://www.linkedin.com/search/results/people/?origin=DISCOVER_FROM_SEARCH_HOME"
    name = connection_name
    d.get(search_page)
    time.sleep(3)
    d.find_element_by_class_name("search-typeahead-v2").click()
    d.find_elements_by_xpath("//input[@placeholder='Search']")[0].send_keys(name)
    d.find_elements_by_xpath("//input[@placeholder='Search']")[0].send_keys(Keys.ENTER)
    move_bar()
    time.sleep(1)
    try:
        d.find_element_by_class_name("actor-name").click()
    except NoSuchElementException:
        return
    time.sleep(4)
    relation_container = []
    relation_container.append(name)
    try:
        company = d.find_element_by_class_name("pv-top-card-section__company").text
        relation_container.append(company)
    except NoSuchElementException:
        company = "N/A"
        relation_container.append(company)
    print (relation_container[1])
    raw_image_url = d.find_element_by_class_name("presence-entity__image").get_attribute("style")
    image_url = raw_image_url.split("\"")[1]
    relation_container.append(image_url)
    print (image_url)
    first_degree_profile_dict.append(relation_container)

    try:
        d.find_element_by_class_name("img-container")
    except NoSuchElementException:
        print ("cant find the \" see connections \" button, this profile might have no connections at all")
        return

    d.find_element_by_class_name("facepile").click()

    record = 0
    get_second_degree_connection_names(name, record)


def get_second_degree_connection_names(connection_name,record):
    try:
        d.find_elements_by_class_name("search-result__wrapper")
    except NoSuchElementException:
        print("There's no common connection for this company:", company)
        print("Error message is:", NoSuchElementException)
        return

    for i in range (0, 4):
        slightly_move_page()
    # move_bar()

    results = d.find_elements_by_class_name("search-result__wrapper")

    for i in results:
        name = i.find_element_by_class_name("actor-name").text
        print (name)
        print (connection_name)
        # degree = i.find_element_by_class_name("dist-value").text
        # print (degree)
        title = i.find_element_by_class_name("search-result__truncate").text
        print (title)
        image_url = i.find_element_by_class_name("lazy-image").get_attribute("src")
        print (image_url)
        relation_container = []
        relation_container.append(name)
        relation_container.append(connection_name)
        relation_container.append(title)
        relation_container.append(image_url)
        write_second_degree_related_name_and_connect_into_csv_each_time(relation_container)
        second_degree_profile_dict.append(relation_container)


    time.sleep(2)

    flag = move_pages()

    if flag is "end" or record >= 4:
        return
    else:
        record += 1
        get_second_degree_connection_names(connection_name, record)


def write_second_degree_related_name_and_connect_into_csv_each_time(relation_container):
    #linkedin has detects mode, so we do it in this way.
    csv_file = open("full_second.csv", "a")
    writer = csv.writer(csv_file)
    writer.writerow(relation_container)




def slightly_move_page():
    js_down="var q=document.documentElement.scrollTop=400"
    d.execute_script(js_down)
    print ("scroll down !!!!!")
    time.sleep(1)

def move_bar():
    js="var q=document.documentElement.scrollTop=200000"
    d.execute_script(js)
    print ("the bar has been moved down")
    time.sleep(1)


def move_pages():
    try:
        d.find_element_by_class_name("next")
    except NoSuchElementException:
        print("Already in the next final page, no more profile data for this person's connection")
        return "end"

    d.find_element_by_class_name("next").send_keys(webdriver.common.keys.Keys.SPACE)


def scrape():
    linkedin_login(email, password)

    d.get(start_url)

    get_connection_details()

if __name__ == "__main__":
    linkedin_login(email, password)
    get_first_degree_connections_name()
    get_first_degree_company_and_image_and_related_connections()


    print ("finished")
