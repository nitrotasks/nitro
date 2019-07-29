package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/gorilla/mux"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

var (
	proxyTarget string
	remote      *url.URL
	port        string
	staticPath  string
	indexPath   string
	useLambda   bool
	router      *mux.Router
	adapter     *GorillaMuxAdapter
)

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func init() {
	flag.StringVar(&proxyTarget, "proxyTarget", getEnv("PROXY_TARGET", "https://go.nitrotasks.com/a/"), "path to your api")
	flag.StringVar(&port, "port", getEnv("PORT", "8080"), "tcp port to listen on")
	flag.StringVar(&staticPath, "staticPath", getEnv("STATIC_PATH", "../dist"), "path to static folder")
	flag.StringVar(&indexPath, "indexPath", getEnv("INDEX_PATH", "index.html"), "path to fallback index.html")
	flag.BoolVar(&useLambda, "useLambda", os.Getenv("USE_LAMBDA") == "true", "AWS Lambda instead of Web Server")
	flag.Parse()

	var err error
	remote, err = url.Parse(proxyTarget)
	if err != nil {
		panic(err)
	}

	ping := NewPing()
	proxy := NewProxy()
	router = mux.NewRouter()

	router.HandleFunc("/ping", ping.Handler()).Methods("GET", "HEAD")

	hostReverseProxy := httputil.NewSingleHostReverseProxy(remote)
	router.HandleFunc("/a/{rest:.*}", proxy.Handler(hostReverseProxy))

	spa := spaHandler{staticPath: staticPath, indexPath: indexPath}
	router.PathPrefix("/").Handler(spa)
}

// LambdaHandler is an alternative entry point for AWS Lambda
func LambdaHandler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return adapter.ProxyWithContext(ctx, req)
}

func main() {
	if useLambda {
		adapter = New(router)
		lambda.Start(LambdaHandler)
	} else {
		addr := fmt.Sprintf("0.0.0.0:%s", port)
		srv := &http.Server{
			Handler:      router,
			Addr:         addr,
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		}
		fmt.Printf("Listening on %s, proxying unknown requests to %s\n", addr, proxyTarget)
		log.Fatal(srv.ListenAndServe())
	}
}
