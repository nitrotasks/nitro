package main

import (
	"fmt"
	"net/http"
)

// Ping is our for a basic http response
type Ping struct{}

// NewPing returns an initialized Ping
func NewPing() *Ping {
	return &Ping{}
}

// Handler returns a basic response
func (p Ping) Handler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong\n")
	}
}
