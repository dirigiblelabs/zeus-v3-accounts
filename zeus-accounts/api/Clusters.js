var rs = require('http/v3/rs');
var dao = require('zeus-accounts/data/dao/Clusters');
var http = require('zeus-accounts/api/http');

rs.service()
	.resource('')
		.get(function() {
			var entities = dao.list();
			http.sendResponseOk(entities);
		})
	.resource('{id}')
		.get(function(ctx) {
			var id = ctx.pathParameters.id;
			var entity = dao.get(id);
			if (entity) {
			    http.sendResponseOk(entity);
			} else {
				http.sendResponseNotFound('Clusters not found');
			}
		})
	.resource('')
		.post(function(ctx, request, response) {
			var entity = request.getJSON();
			entity.id = dao.create(entity);
			response.setHeader('Content-Location', '/services/v3/js/zeus-accounts/api/Clusters.js/' + entity.id);
			http.sendResponseCreated(entity);
		})
	.resource('{id}')
		.put(function(ctx, request) {
			var entity = request.getJSON();
			entity.id = ctx.pathParameters.id;
			dao.update(entity);
			http.sendResponseOk(entity);
		})
	.resource('{id}')
		.delete(function(ctx) {
			var id = ctx.pathParameters.id;
			var entity = dao.get(id);
			if (entity) {
				dao.delete(id);
				http.sendResponseNoContent();
			} else {
				http.sendResponseNotFound('Clusters not found');
			}
		})
.execute();