using SmartGriev.Models;

namespace SmartGriev.Controllers.AdminControllers
{
    public class SlaReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public SlaReminderService(
            IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope =
                    _scopeFactory.CreateScope();

                var context =
                    scope.ServiceProvider
                    .GetRequiredService<Ict2smartGrievDbContext>();

                // SLA checking code here

                await Task.Delay(
                    TimeSpan.FromMinutes(30),
                    stoppingToken);
            }
        }
    }
}
