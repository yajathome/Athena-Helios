package api

import "time"

type Apartment struct {
	ID            int       `json:"id"`
	ApartmentName string    `json:"apartment_name"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
