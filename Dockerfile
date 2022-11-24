FROM node:18.04

ENV WORK_DIR=/bot

# create the directories to load the bot code into
RUN mkdir -p $WORK_DIR

# Tell docker where our working directory lives
WORKDIR $WORK_DIR

# Copy the files over
COPY . $WORK_DIR

# Expose port 80 so it can talk to the world
EXPOSE 80

ENTRYPOINT $WORK_DIR/build.sh
