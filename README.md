# EPIC-Mail 
 

 [![Build Status](https://travis-ci.org/EmyRukundo/EPIC-Mail.svg?branch=develop)](https://travis-ci.org/EmyRukundo/EPIC-Mail)  ![Coveralls github](https://img.shields.io/coveralls/github/EmyRukundo/EPIC-Mail.svg?style=popout)  [![Maintainability](https://api.codeclimate.com/v1/badges/430aae199b238ec60664/maintainability)](https://codeclimate.com/github/EmyRukundo/EPIC-Mail/maintainability)




## App Description

    web app that helps people exchange messages/information over the internet.

    A User can creates account, compose email,view inbox, can see unread and

    Sent email, and can also delete email.
    
    This is the link for Pivot Track: https://www.pivotaltracker.com/n/projects/2314962


## Technologies Used

    JavaScript - Programming Language

    NodeJS - Server Environment

    Mocha and Chai - Test Framework And Assertion Library

    Travis-CI - Continuous Integration Testing

    Coveralls - Continuous Integration Test Coverage

    Code Climate - Continuous Integration Code Quality

    Heroku - App Deployed on Heroku

    GIT - Version Control System

    GitHub Pages - Front-End UI Hosting is Hosted: https://emyrukundo.github.io/EPIC-Mail/ 



## Running the api Locally

    clone the repo or download the zip
    Navigate to the folder where you downloaded or cloned the app
    Make sure you are on the Develop branch (Because the Develop branch has all the recent code)
    Run npm install from the terminal(make sure the port 4000 is free).
    Run npm start from the terminal to start the app.
    With the ideal tool preferably postman, send requests to the endpoints descriped bellow.


## API ENDPOINT ROUTES ON DATBASE
   
| METHOD  |	ROUTES                 |	DESCRIPTION                 |
|-------- |-----------------------|-----------------------------|        	                                  
| POST    |	api/v2/auth/signup    |    User Registration        |	
| POST    |	api/v2/auth/login     |	   User Login 	             |
| GET     | api/v2/auth/getUsers  |    Retrieve all users       |
| POST    |	api/v2/messages       |    Send Email 	             |
| GET 	  | api/v2/messages        |   	Retrieve Received Emails | 	
| GET 	  | api/v2/messages        |    Retrieve A Specific Email| 	
| DELETE  |	api/v2/messages       |	   Delete A Specific Email  | 	
| GET 	  | api/v2/message/sent    | 	  Retrieve Sent Emails     | 	
| GET 	  | api/v2/message/unread  |	   Retrieve unRead Emails   |
 

## Information on the API

       If you are running this app API on from the hosted version, the following urls link:
       https://arcane-shelf-53833.herokuapp.com/api/ 
          

       If you are running this app from your local computer, the following urls link:
       http://localhost:5000 
 
   