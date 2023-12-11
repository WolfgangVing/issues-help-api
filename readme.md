# Issues API

### Description

This project is simple version, no-production ready, of a api which gives power to clients open tickets with issues to be solved by operators or admins of one bussiness. 

Possessing fundamental things, thought not fully developed, essential to any bussiness that uses this service, like authorization and authentication with JWT(JSON WEB TOKEN), and an NO-SQL MongoDB database for storing and managing permanent data and a in-memory Redis database for caching, making use of the pattern cache-aside to improve performance.

## Prerequisites
Before running the project, make sure you have the following tools installed:

* Docker
* Node.js (>=16.x)
* npm

## Instalation

1. Clone the repository, in your terminal run:
```bash
git clone https://github.com/WolfgangVing/issues-help-api.git
cd issues-help-api
```

2. Install Dependencies:
```bash
npm install
```

3. Run the project as development:
```
npm run start
```

Note: If you are in a linux distro you probrably will have problem with running the third instruction because of permission issues with Docker. For you to run use `sudo npm run start`.


## API Endpoints
The API includes Swagger documentation for easy exploration of available endpoints. After starting the project navigate to:
`https:localhost:3000/api`. Nonetheless here will be shown a summary of it.<br>


#### Permissions/Roles needed
\* Authentication only<br>
** Client<br>
*** Admin or Operators<br>
\**** Admin only

### AUTH
This endpoints is primarly to make login into the api and reserve a jwt token

* `POST /auth/login` Sign-in to USERS

### USERS
This endpoints is for creating and managing users data, being clients, operators or admins, with due restrictions put for permissions based in those roles.

* `POST /users` Create a new user
* `GET /users` Get a list of users ***
* `GET /users/:id` Get a user by id ***
* `PATCH /users/:id` Update a user by id \*

### ISSUES
Here is bussiness primary logic of this project, here users will create their issues only for operators and admins to solve them.

* `POST /issues` Create a new issue **
* `GET /issues` Get a list of issues *
* `GET /issues/:id` Get a issue by id *
* `PATCH /issues/:id` Update a issue by id *
* `DELETE /issues/:id` Delete a issue by id \****

Make sure to check the codebase and the Swagger documentation for a detailed description of each endpoint

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests. Your feedback and contributions are highly appreciated.

## License
This project is licensed under the MIT License