package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (app *Application) Routes() http.Handler {
	mux := chi.NewRouter()

	mux.Use(app.enableCORS)

	mux.Post("/apartment-login", app.ApartmentLogin)
	mux.Post("/apartment-register", app.ApartmentRegister)
	mux.Post("/resident-login", app.ResidentLogin)
	mux.Post("/resident-register", app.ResidentRegister)

	return mux
}
