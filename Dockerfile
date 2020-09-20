# The instructions for the first stage
FROM node:10.13 as builder

# ARG NODE_ENV=development
# ENV NODE_ENV=${NODE_ENV}

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
RUN npm run build

# The instructions for second stage
FROM node:10.13

WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules
COPY --from=builder dist dist

COPY . .

CMD [ "npm", "run", "serve" ]