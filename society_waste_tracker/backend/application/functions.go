package api

import (
	"golang.org/x/crypto/bcrypt"
)

func (app *Application) HashPassword(password string) (hashPassword []byte) {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return hashed
}

func (app *Application) CompareHashPassword(hashPassword []byte, password []byte) error {
	return bcrypt.CompareHashAndPassword(hashPassword, password)
}
