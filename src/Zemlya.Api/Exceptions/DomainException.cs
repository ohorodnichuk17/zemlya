namespace Zemlya.Api.Exceptions;

public abstract class DomainException(string message) 
    : Exception(message);

public sealed class ConflictException(string message) 
    : DomainException(message);

public sealed class NotFoundException(string message) 
    : DomainException(message);

public sealed class UnauthorizedException(string message) 
    : DomainException(message);
