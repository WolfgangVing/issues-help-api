# Use the official MongoDB image as the base image
FROM mongo:latest

# Expose the default MongoDB port
EXPOSE 27017

# SET the variables of the MongoDB Container

CMD ["mongod"]