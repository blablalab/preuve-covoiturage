install:
	@docker-compose down
	@docker-compose build --force-rm
	@git clone git@github.com:betagouv/preuve-covoiturage-api.git back-api
	@git clone git@github.com:betagouv/preuve-covoiturage-dashboard.git dashboard
	@docker-compose run api yarn
	@docker-compose run aom yarn
	@docker-compose run ope yarn
	@docker-compose run reg yarn
	@echo "Installation completed"

dash:
	@docker-compose run -p 4200:4200 dashboard bash -c "ng serve --host 0.0.0.0"

wipe: fix
	@rm -rf back-api/node_modules
	@rm -rf front-aom/node_modules
	@rm -rf front-ope/node_modules
	@rm -rf front-reg/node_modules

fix:
	mkdir -p back-api
	mkdir -p front-aom
	mkdir -p front-ope
	mkdir -p front-reg
	sudo chown -R $(shell whoami): back-api
	sudo chown -R $(shell whoami): front-aom
	sudo chown -R $(shell whoami): front-ope
	sudo chown -R $(shell whoami): front-reg

