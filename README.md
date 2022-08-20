# Studying App Server

This is the server for the [studying app](https://github.com/benjaminJohnson2204/studying-app) I created. The server is hosted on Heroku at https://studying-app-server.herokuapp.com/.

## Tech Stack

I used MongoDB, Express, and Node to create the server.

## Running instructions

To run the server, use the command `npm start`. To run the tests, use the command `npm test`.

## Code Structure

The main file that is run when the server runs is `index.js`.

### Database

The `db` directory contains code for interfacing with my MongoDB database. Within that directory, the `models` directory contains definitions of my data models:

- Question: A question that users can answer. Each question has fields for text (what the actual question is), what category the question is under, and an array of options (possible answers the user can choose from). Each option contains fields for the text of the actual option, an explanation (which is displayed to users when they select an option), an index, and whether it is the correct option.
- User: A user of the site. There are fields for the username and a hash of the password (I used bcrypt to hash passwords, and passport for authentication).
- UserAnswer: An answer a user has given to a question. There are fields for which user has given the answer, what question the answer is to, the index of the selected question option, and whether the answer is correct.

The `services` directory contains code for creating, reading, updating, and deleting data of these models.

### Routes

The `routes` directory contains code for all the server's API routes. The routes are divided into `auth`, `category`, `question`, and `userAnswer`.

`Auth` contains routes for authenticating and registering users. I used token authentication for the app (I chose token over session authentication since I couldn't get session data to be stored on the mobile app).

- Users can login with `post` requests to `auth/login`, and can register with `post` requests to `auth/register`. Upon successful authentication, the server responds with a token that must be set as a header in future requests to verify the user as authenticated.
- The `ensureAuthenticated` middleware ensures this token was provided and is valid before allowing the user to make requests to certain endpoints, such as those about the user's past answers.
- `Get` requests to `auth/tokenIsValid` check whether a certain token is valid, in order to check if the user is logged in.

`Category` contains routes to get data about categories of questions.

- The only route here is `category/all`, which returns all existing categories of questions. I used to have more category routes before I redesigned my database to store categories only as a string field within questions, rather than as their own documents.

`Question` contains routes to get available questions.

- `Get` requests to `question/category/:category` will return all questions under a certain category.
- `Get` requests to `question/fractionComplete` will return what fraction of the way through each category a user is. For example, if there are 4 questions under a category and a user has answered 2 of them correctly, the server would respond with `{total : 4, correct : 2}` for that category.
- `Get` requests to `question/fractionComplete/:category` also get the fraction of the way through a category the user is, but only for a single category.
- `Get` requests to `question/:questionId` get data about a single question by ID.

`UserAnswer` contains routes to answer questions and view a user's past answers to questions.

- `Post` requests to `userAnswer/answer` will answer a certain question (by ID) with the option of a certain index.
- `Get` requests to `userAnswer/all` will return a user's past answers to all questions.
- `Get` requests to `userAnswer/category/:category` will return all a user's past answers to all questions of a certain category.
- `Get` requests to `userAnswer/question/:questionId` will return any answer(s) a user has made to a certain question.
- `Post` requests to `userAnswer/reset` will reset the user's progress on all questions; that is, delete all a user's past answers.
- `Post` requests to `userAnswer/reset/category/:category` will reset the user's progress on a certain category.
- `Post` requests to `userAnswer/reset/question/:questionId` will reset the user's answer(a) to a certain question.

### Tests

The `test` directory contains tests for my APIs. I used Mocha, Chai, and ChaiHttp for the tests.

`testPreparer.js` prepares for the tests by using Mongounit to create a separate testing database.

`authentication_tests` are tests of my authentication system and routes. They test registering, logging in, logging out, and using tokens to access endpoints requiring authentication.

`question_tests` are tests of the question and answer routes described above.
