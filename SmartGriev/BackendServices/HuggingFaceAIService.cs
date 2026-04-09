using System.Text;
using System.Net.Http.Headers;
using System.Text.Json;

namespace SmartGriev.BackendServices
{
    public class HuggingFaceAIService
    {
        private readonly HttpClient _http;
        private const string HuggingFaceModel = "https://api-inference.huggingface.co/models/MoritzLaurer/deberta-v3-base-zeroshot-v1";
        //private readonly string BearerToken = Environment.GetEnvironmentVariable("HuggingFaceAPI") ?? throw new Exception("HuggingFace API key not found in environment variables"); // Your Hugging Face token

        //public HuggingFaceAIService(HttpClient http) => _http = http;

        private readonly string _bearerToken;

        public HuggingFaceAIService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _bearerToken = config["HuggingFace:ApiKey"]
                ?? throw new Exception("HuggingFace API key not found in configuration");
        }

        public async Task<string> DetectCategory(string description)
        {
            string fallback = PredictCategory(description);
            try
            {
                var request = new
                {
                    inputs = description,
                    parameters = new { candidate_labels = new[] { "Garbage", "Road", "Water", "Electricity", "Drainage" } },
                    options = new { wait_for_model = true }
                };

                var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
                var message = new HttpRequestMessage(HttpMethod.Post, HuggingFaceModel)
                {
                    Content = content,
                    Headers = { Authorization = new AuthenticationHeaderValue("Bearer",_bearerToken) }
                };

                var start = DateTime.UtcNow;
                while ((DateTime.UtcNow - start).TotalSeconds < 50)
                {
                    var response = await _http.SendAsync(message);
                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();
                        var doc = JsonDocument.Parse(json);
                        if (doc.RootElement.TryGetProperty("labels", out var labels))
                            return labels[0].GetString() ?? fallback;
                    }
                    else if ((int)response.StatusCode == 410) // Model asleep
                        await Task.Delay(5000);
                    else
                        break; // Any other error → fallback
                }
            }
            catch { }

            return fallback; // Return manual category if model fails
        }

        private string PredictCategory(string text)
        {
            text = text.ToLower();

            if (text.Contains("garbage") || text.Contains("waste"))
                return "Garbage Not Collected In Area"; // matches DB
            if (text.Contains("overflow"))
                return "Overflowing Dustbin"; // matches DB
            if (text.Contains("water") || text.Contains("pipe") || text.Contains("leak"))
                return "Water Leakage";
            if (text.Contains("street light") || text.Contains("light"))
                return "Street Light Not Working";
            if (text.Contains("electric") || text.Contains("wire") || text.Contains("pole"))
                return "Loose Electric Wires";
            if (text.Contains("road") || text.Contains("pothole"))
                return "Road Damage";

            return "General";
        }
    }
}
