# NASA project - Course by ZTM for nodejs

This is a Nodejs backend with a React frontend.
Here is a diagram showing the architecture of the project:

![NASA Architecture Diagram](./architecture-diagram.png)




Launch the project with the following command:

```npm run deploy```

Access the frontend at

```http://localhost:8000```

Use postman to make requests directly to the REST API:

```http://localhost:3000```

... Or find our POSTMAN collection in this folder: ```NASA-API.postman_collection.json```

See also our openapi specification in `openapi.yaml`



# Pending issues...

> Our tests are still creating entries in our database each time we run them.
> Business logic would need to be consolidated:
    > We can still cancel a launch that is successful
    > We can create launches in the past
> Get a single launch is broken
> Anything else?