# How to run the backend

`cd api`

`composer install`

copy .env.example and rename to .env 

Change database connection configuration

`php artisan key:generate`

`php artisan migrate:refresh --seed`

`php artisan passport:install`

`php artisan serve`