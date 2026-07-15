using Carter;

namespace Zemlya.Api.Features.MapProxy;

public class MapProxyEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/map-proxy/Home/Map", async () =>
        {
            using var httpClient = new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            });

            try
            {
                var html = await httpClient.GetStringAsync("https://organicportal.in.ua:8090/Home/Map");

                var customStyles = @"
                                        <style>
                                            .site-header, 
                                            .side-main-menu, 
                                            .side-menu-btn-container, 
                                            #trapezoid, 
                                            .about-site, 
                                            footer { 
                                                display: none !important; 
                                            }
                                            .container-fluid { 
                                                height: 100vh !important; 
                                                padding: 0 !important; 
                                                margin: 0 !important; 
                                            }
                                            div.row[ng-controller=""MapController""] { 
                                                height: 100vh !important; 
                                                margin: 0 !important; 
                                            }
                                            html, body { 
                                                height: 100vh !important; 
                                                margin: 0 !important; 
                                                padding: 0 !important; 
                                                overflow: hidden !important; 
                                            }
                                        </style>
                                        ";
                
                var modifiedHtml = html.Replace("</head>", $"{customStyles}</head>");

                return Results.Content(modifiedHtml, "text/html");
            }
            catch
            {
                return Results.StatusCode(502);
            }
        });
    }
}
