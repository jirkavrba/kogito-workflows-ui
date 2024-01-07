<img src="./public/kogito.svg" width="50">

# Kogito Workflows UI

A tool for inspecting and managing Kogito serverless workflow instances.

This project is not affiliated with neither Kogito, Sonata Flow nor KIE group.

## Using the hosted instance

There is an instance of the application running on [kogito.vrba.dev](https://kogito.vrba.dev) that can be configured and used. 

## Running the application yourself

The simplest way to run the application is to use a pre-built docker image hosted on Gitlab.

```
docker run -p 8080:80 registry.gitlab.com/jirkavrba/kogito-workflows-ui:0.0.1
```

The application will be running on [localhost:8080](http://localhost:8080). 