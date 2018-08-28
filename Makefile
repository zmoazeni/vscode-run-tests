.DEFAULT_GOAL := zsh

zsh:
	docker-compose run --rm node zsh

.PHONY: zsh
