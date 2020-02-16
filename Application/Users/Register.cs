using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Extensions;
using Application.Common.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                
                RuleFor(x => x.Username).NotEmpty();
                
                RuleFor(x => x.Email)
                    .NotEmpty()
                    .EmailAddress();
                
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }
            
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(x => x.Email == request.Email, cancellationToken: cancellationToken))
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already in use" });

                if (await _context.Users.AnyAsync(x => x.UserName == request.Username, cancellationToken: cancellationToken))
                    throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists" });
                
                var user = new AppUser()
                {
                    DisplayName = request.Username,
                    UserName = request.Username,
                    Email = request.Email
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Username = user.UserName,
                        Token = _jwtGenerator.CreateToken(user),
                        Image = null
                    };
                
                throw new Exception("Problem creating user");
            }
        }
    }
}