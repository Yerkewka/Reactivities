using FluentValidation;

namespace Application.Common.Extensions
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6).WithMessage("'{PropertyName}' must be at least 6 characters")
                .Matches("[A-Z]").WithMessage("'{PropertyName}' must have at least 1 uppercase character")
                .Matches("[a-z]").WithMessage("'{PropertyName}' must have at least 1 lowercase character")
                .Matches("[0-9]").WithMessage("'{PropertyName}' must contain a number")
                .Matches("[^a-zA-Z0-9]").WithMessage("'{PropertyName}' must contain non alphanumeric");

            return options;
        }
    }
}