package api

import (
	"log"
	"net/http"
)

func (app *Application) ApartmentLogin(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	user, err := app.LoginApartment(ApartmentAuthInput(inputPayload))
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	var payload = struct {
		User Apartment `json:"user"`
	}{
		User: user,
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ApartmentRegister(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	check, err := app.RegisterApartment(ApartmentAuthInput(inputPayload))
	if err != nil && !check {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := struct {
		Message string `json:"message"`
	}{
		Message: "Apartment successfully created",
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentLogin(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		FlatNumber    string `json:"flat_number"`
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	user, err := app.LoginResident(ResidentAuthInput(inputPayload))
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	var payload = struct {
		User Resident `json:"user"`
	}{
		User: user,
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentRegister(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		FlatNumber    string `json:"flat_number"`
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	log.Println(inputPayload)

	check, err := app.RegisterResident(ResidentAuthInput(inputPayload))
	if err != nil && !check {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := struct {
		Message string `json:"message"`
	}{
		Message: "Resident account successfully created",
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentDashboard(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ID int `json:"id"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)
	queryGetDistinct := `select distinct month from wastes where resident_id=$1`
	rowsMonthDistinct, _ := app.DB.Query(queryGetDistinct, inputPayload.ID)

	var months []string
	for rowsMonthDistinct.Next() {
		var month string
		_ = rowsMonthDistinct.Scan(&month)
		months = append(months, month)
	}

	type wastePerMonth struct {
		WasteAmount int    `json:"waste_amount"`
		Month       string `json:"month"`
	}
	var wastePerMonthList []wastePerMonth

	for _, month := range months {
		queryGetWaste := `select waste_generated from wastes where resident_id=$1 and month=$2`
		rowsGetWaste, _ := app.DB.Query(queryGetWaste, inputPayload.ID, month)

		wasteTotal := 0
		for rowsGetWaste.Next() {
			var wasteCurrentRow int
			_ = rowsGetWaste.Scan(&wasteCurrentRow)
			wasteTotal += wasteCurrentRow
		}

		wastePerMonthList = append(wastePerMonthList, wastePerMonth{
			WasteAmount: wasteTotal,
			Month:       month,
		})
	}

	var payload = struct {
		WastePerMonth []wastePerMonth `json:"waste_per_month"`
	}{
		WastePerMonth: wastePerMonthList,
	}

	log.Println(payload)

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentLogWastes(w http.ResponseWriter, r *http.Request) {

}

func (app *Application) ApartmentDashboard(w http.ResponseWriter, r *http.Request) {

}
