FROM mpp_base:latest

RUN yarn build
RUN cd packages/web/ &&\
    yarn ng build --prod --aot=false --buildOptimizer=false
