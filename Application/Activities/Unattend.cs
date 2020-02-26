using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid ActivityId { get; set; }
        }

        public class CommandHandler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public CommandHandler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.SingleOrDefaultAsync(x => x.Id == request.ActivityId, cancellationToken: cancellationToken);
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity" });

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername(), cancellationToken: cancellationToken);

                var attendance = await _context.UserActivities.SingleOrDefaultAsync(x => 
                        x.ActivityId == activity.Id
                        && x.AppUserId == user.Id,
                    cancellationToken);
                
                if (attendance == null)
                    return Unit.Value;
                
                if (attendance.IsHost)
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "You cannot remove yourself as host" });

                _context.UserActivities.Remove(attendance);
                
                var success = await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false) > 0;
                if (success) return Unit.Value;
                
                throw new Exception("Problem saving changes");
            }
        }
    }
}