<img src="./public/kogito-ui.svg" width="64">

# Kogito Workflows UI

A tool for inspecting and managing Kogito serverless workflow instances.

This project is not affiliated with neither Kogito, Sonata Flow nor KIE group.

## Using the hosted instance

There is an instance of the application running on [kogito.vrba.dev](https://kogito.vrba.dev) that can be configured and used. 

## Running the application yourself

The simplest way to run the application is to use a pre-built docker image hosted on Gitlab.

```
docker run -p 8080:80 -it registry.gitlab.com/jirkavrba/kogito-workflows-ui
```

To build the application from scratch, clone the repository, build docker image locally and run it.

```
git clone https://gitlab.com/jirkavrba/kogito-workflows-ui

cd kogito-workflows-ui
docker build -t kogito-workflows-ui -f ./docker/Dockerfile .
docker run -p 8080:80 -it kogito-workflows-ui
```

The application will be then running on [localhost:8080](http://localhost:8080). 
