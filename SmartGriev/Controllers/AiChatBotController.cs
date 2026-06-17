using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace SmartGriev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiChatBotController : ControllerBase
    {
        private readonly List<BotIntent> intents = new()
        {
            // GREETING
            new BotIntent
            {
                IntentName = "Greeting",
                Keywords = new[] { "hi", "hello", "hey", "good morning", "good evening", "greetings", "whats up" },
                Response = "👋 Hello! Welcome to SmartGriev Assistant.\n\nI can help you with:\n• Register complaints\n• Track complaint status\n• View complaint categories\n• Understand how SmartGriev works"
            },

            // ABOUT SYSTEM
            new BotIntent
            {
                IntentName = "AboutSystem",
                Keywords = new[] { "smartgriev", "what is smartgriev", "about system", "explain system", "what does it do", "how this app works" },
                Response = "🏢 SmartGriev is a digital grievance management system for Surat City.\n\nCitizens can:\n• Report civic issues\n• Track complaint progress\n• Receive updates in real-time\n• Communicate with departments online"
            },

            // HOW IT WORKS
            new BotIntent
            {
                IntentName = "Workflow",
                Keywords = new[] { "how it works", "process", "workflow", "system work", "steps" },
                Response = "⚙ SmartGriev Complaint Process:\n\n1️⃣ Citizen submits complaint\n2️⃣ Complaint reaches SMC department\n3️⃣ Department reviews issue\n4️⃣ Issue gets resolved\n5️⃣ Status updates automatically"
            },

            // REGISTER COMPLAINT
            new BotIntent
            {
                IntentName = "RegisterComplaint",
                Keywords = new[] { "register complaint", "file complaint", "submit complaint", "raise complaint", "new complaint", "grievance", "i want to complain", "report issue" },
                Response = "📝 To register a complaint:\n\n• Open Complaint Form\n• Select complaint category\n• Enter location details\n• Describe the issue\n• Submit complaint"
            },

            // ROAD
            new BotIntent
            {
                IntentName = "RoadComplaint",
                Keywords = new[] { "road", "pothole", "broken road", "road damage", "street damage", "bad road" },
                Response = "🛣 Road-related complaint detected.\n\nPlease submit:\n• Exact location\n• Road issue details\n• Optional image proof"
            },

            // WATER
            new BotIntent
            {
                IntentName = "WaterComplaint",
                Keywords = new[] { "water leakage", "water problem", "pipe leakage", "dirty water", "water supply", "water issue", "no water" },
                Response = "🚰 Water-related complaint detected.\n\nPlease provide:\n• Area/location\n• Type of water issue\n• Additional details"
            },

            // ELECTRICITY
            new BotIntent
            {
                IntentName = "ElectricityComplaint",
                Keywords = new[] { "street light", "electricity", "electric wire", "light problem", "power issue", "electric pole", "power cut" },
                Response = "💡 Electricity complaint detected.\n\nPlease provide:\n• Pole/light location\n• Issue description\n• Nearby landmark"
            },

            // GARBAGE
            new BotIntent
            {
                IntentName = "GarbageComplaint",
                Keywords = new[] { "garbage", "waste", "trash", "dirty area", "cleanliness", "dustbin", "litter" },
                Response = "🗑 Garbage complaint detected.\n\nPlease provide:\n• Area name\n• Garbage issue details\n• Optional photo"
            },

            // DRAINAGE
            new BotIntent
            {
                IntentName = "DrainageComplaint",
                Keywords = new[] { "drainage", "drain", "water overflow", "blocked drain", "sewage", "gutter" },
                Response = "🚧 Drainage complaint detected.\n\nPlease provide:\n• Drainage issue location\n• Overflow/blockage details"
            },

            // STATUS
            new BotIntent
            {
                IntentName = "ComplaintStatus",
                Keywords = new[] { "status", "track complaint", "track", "progress", "pending", "resolved", "check complaint", "update" },
                Response = "📌 To check complaint status:\n\n• Open 'My Complaints'\n• Enter Complaint ID\n• View latest progress"
            },

            // CATEGORIES
            new BotIntent
            {
                IntentName = "Categories",
                Keywords = new[] { "categories", "types", "what can i report", "complaint options", "list" },
                Response = "📋 Available Complaint Categories:\n\n🚰 Water Issues\n🛣 Road Damage\n💡 Street Lights\n🗑 Garbage Collection\n⚡ Electricity Problems\n🚧 Drainage Issues"
            },

            // HISTORY
            new BotIntent
            {
                IntentName = "History",
                Keywords = new[] { "history", "old complaints", "past complaints", "previous complaints", "my records" },
                Response = "📂 Your complaint history is available in the 'My Complaints' section."
            },

            // DASHBOARD
            new BotIntent
            {
                IntentName = "Dashboard",
                Keywords = new[] { "dashboard", "total complaints", "count", "how many complaints", "analytics" },
                Response = "📊 Dashboard shows:\n\n• Total complaints\n• Pending complaints\n• Resolved complaints"
            }
        };

        [HttpPost]
        public IActionResult Chat([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return Ok(new { reply = "⚠ Please enter your message." });
            }

            // Normalization: Lowercase and strip punctuation
            string cleanMsg = Regex.Replace(request.Message.ToLower(), @"[^\w\s]", " ").Trim();

            string response = GetSmartResponse(cleanMsg);

            return Ok(new { reply = response });
        }

        private string GetSmartResponse(string userMsg)
        {
            var userTokens = userMsg.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (userTokens.Length == 0) return GetFallbackResponse();

            BotIntent bestIntent = null;
            double highestScore = 0.0;

            foreach (var intent in intents)
            {
                double intentMaxScore = 0.0;

                // Check against each keyphrase grouped under this intent
                foreach (var keywordPhrase in intent.Keywords)
                {
                    var keywordTokens = keywordPhrase.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                    // Count how many words intersect between user message and target keyword phrase
                    int matches = userTokens.Intersect(keywordTokens).Count();

                    if (matches > 0)
                    {
                        // Jaccard-like Similarity scoring method
                        double score = (double)matches / (userTokens.Length + keywordTokens.Length - matches);

                        if (score > intentMaxScore)
                        {
                            intentMaxScore = score;
                        }
                    }
                }

                if (intentMaxScore > highestScore)
                {
                    highestScore = intentMaxScore;
                    bestIntent = intent;
                }
            }

            // High precision filtering threshold (Adjust between 0.1 and 0.5 depending on flexibility needs)
            if (bestIntent != null && highestScore >= 0.15)
            {
                return bestIntent.Response;
            }

            return GetFallbackResponse();
        }

        private string GetFallbackResponse()
        {
            return "🤖 Sorry, I could not understand your request.\n\nYou can ask things like:\n" +
                   "• Register complaint\n" +
                   "• Water leakage issue\n" +
                   "• Track complaint status\n" +
                   "• Road damage complaint\n" +
                   "• What is SmartGriev?";
        }
    }

    public class BotIntent
    {
        public string IntentName { get; set; } = "";
        public string[] Keywords { get; set; } = Array.Empty<string>();
        public string Response { get; set; } = "";
    }

    public class ChatRequest
    {
        public string Message { get; set; } = "";
    }
}