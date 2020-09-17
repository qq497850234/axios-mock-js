/* eslint-disable */
import { Notification } from 'element-ui';
import { useRequestInterceptor, useResponseInterceptor } from './util';
import { createRequestInterceptorMiddleware, createResponseInterceptorMiddleware } from './interceptor';
<% _.forEach(config.projects, function(project){ %>import * as {{$$.convertUrl(project.name)}} from './{{project.name}}';
<% }) %>

// register request interceptor
useRequestInterceptor(req => createRequestInterceptorMiddleware(req));

// register response interceptor
useResponseInterceptor(
  res => createResponseInterceptorMiddleware(res),
  error => {
    if (error?.message) {
      Notification.error(error.message);
    }
  }
);

export {<% _.forEach(config.projects, function(project, i){ %>
  {{$$.convertUrl(project.name)}}<% if(config.projects.length - 1 !== i) { %>,<% } %><% }) %>
};
