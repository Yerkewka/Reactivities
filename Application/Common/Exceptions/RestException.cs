using System;
using System.Net;

namespace Application.Common.Exceptions
{
    public class RestException : Exception
    {
        public HttpStatusCode Code { get; set; }
        public object Errors { get; set; }

        public RestException(HttpStatusCode code)
        {
            code = Code;
        }
        
        public RestException(HttpStatusCode code, object errors)
        {
            Code = code;
            Errors = errors;
        }
    }
}