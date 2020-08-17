/* eslint-disable */
import instance from './instance';
import { convertRESTAPI } from '{{$$.relative("util")}}';

<% _.forEach(data.mocks, function(mock){ const project = _.find(config.projects, {id: data.project._id});%>/** {{mock.description}} */
function {{$$.convertMethod(mock, project.urlPreprocessor)}}(opts) {
  return instance({
    method: '{{mock.method}}',
    url: <% if($$.isREST(mock.url)) {%>convertRESTAPI('{{$$.urlPreprocess(mock.url, _.find(config.projects, {id: data.project._id}).urlPreprocessor)}}', opts)<%} else {%> '{{$$.urlPreprocess(mock.url, _.find(config.projects, {id: data.project._id}).urlPreprocessor)}}'<% } %>,
    opts: opts
  });
}

<% }) %>export {<% _.forEach(data.mocks, function(mock, i){ %>
  {{$$.convertMethod(mock, _.find(config.projects, {id: data.project._id}).urlPreprocessor)}}<% if(data.mocks.length - 1 !== i) { %>,<% } %><% }) %>
};
