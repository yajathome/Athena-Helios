package api

import (
	"log"
	"net/http"
)

func (app *Application) ApartmentLogin(w http.ResponseWriter, r *http.Request) {

}

func (app *Application) ApartmentRegister(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)
	log.Println(inputPayload)
}

func (app *Application) ResidentLogin(w http.ResponseWriter, r *http.Request) {

}

func (app *Application) ResidentRegister(w http.ResponseWriter, r *http.Request) {

}
