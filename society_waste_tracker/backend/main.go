package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	api "github.com/srisudarshanrg/athena-helios-sudarshan/society_waste_tracker/backend/application"
)

var app api.Application

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	databasePassword := os.Getenv("DATABASE_PASSWORD")
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	app.DatabaseDSN = fmt.Sprintf("host=postgresql-raptor.alwaysdata.net dbname=raptor_home_scrap port=5432 user=raptor password=%s", databasePassword)
	app.Port = port
	app.DevelopmentFrontendLink = "http://localhost:8100"
	app.ProductionFrontendLink = ""
	app.InProduction = false
	if app.InProduction {
		app.ServeAddress = fmt.Sprintf("0.0.0.0.%d", app.Port)
	} else {
		app.ServeAddress = fmt.Sprintf("localhost:%d", app.Port)
	}

	db, err := app.DBConnect()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = db
	log.Println("Connected to DB successfully")

	log.Println("Application starting up..")
	err = http.ListenAndServe(app.ServeAddress, app.Routes())
	if err != nil {
		log.Fatal(err)
	}
}
