package api

import "database/sql"

type Application struct {
	Port                    int
	DatabaseDSN             string
	DB                      *sql.DB
	DevelopmentFrontendLink string
	ProductionFrontendLink  string
	InProduction            bool
	ServeAddress            string
}
