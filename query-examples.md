# NestJS Query String Examples

This document demonstrates how to read query string values in NestJS with practical examples.

## What are Query Strings?

Query strings are the part of a URL that comes after the `?` character and contain key-value pairs separated by `&`.

Example URL: `http://localhost:3000/users/search?q=john&page=2&limit=10`

Query parameters:

- `q=john`
- `page=2`
- `limit=10`

## Examples in the Users Controller

### 1. Basic Query Parameter Reading

**Endpoint:** `GET /users`
**URL Examples:**

- `http://localhost:3000/users?page=1&limit=5&search=john`
- `http://localhost:3000/users?page=2`
- `http://localhost:3000/users` (no query params)

```typescript
@Get()
findAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('search') search?: string,
) {
  // page, limit, search will be undefined if not provided
  console.log('Page:', page);        // "1" or undefined
  console.log('Limit:', limit);      // "5" or undefined
  console.log('Search:', search);    // "john" or undefined

  return this.usersService.findAll();
}
```

### 2. Single Query Parameter

**Endpoint:** `GET /users/search`
**URL Examples:**

- `http://localhost:3000/users/search?q=john`
- `http://localhost:3000/users/search?q=jane%20doe` (URL encoded spaces)

```typescript
@Get('search')
searchUsers(@Query('q') searchQuery: string) {
  // searchQuery will be the value of 'q' parameter
  return {
    message: `Searching for users with query: ${searchQuery}`,
    query: searchQuery,
  };
}
```

### 3. Multiple Query Parameters with Defaults

**Endpoint:** `GET /users/paginated`
**URL Examples:**

- `http://localhost:3000/users/paginated` (uses all defaults)
- `http://localhost:3000/users/paginated?page=3&limit=20`
- `http://localhost:3000/users/paginated?sortBy=name&order=desc`

```typescript
@Get('paginated')
getPaginatedUsers(
  @Query('page') page: string = '1',      // Default to '1'
  @Query('limit') limit: string = '10',   // Default to '10'
  @Query('sortBy') sortBy: string = 'id', // Default to 'id'
  @Query('order') order: string = 'asc',  // Default to 'asc'
) {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  return {
    pagination: { page: pageNum, limit: limitNum, sortBy, order }
  };
}
```

### 4. Reading All Query Parameters

**Endpoint:** `GET /users/filter`
**URL Examples:**

- `http://localhost:3000/users/filter?name=john&age=25&city=NYC`
- `http://localhost:3000/users/filter?status=active&role=admin&department=IT`

```typescript
@Get('filter')
filterUsers(@Query() queryParams: any) {
  // queryParams will be an object with all query parameters
  console.log('All query parameters:', queryParams);
  // Example: { name: 'john', age: '25', city: 'NYC' }

  return {
    filters: queryParams,
    appliedFilters: Object.keys(queryParams).length,
  };
}
```

### 5. Array Query Parameters

**Endpoint:** `GET /users/by-roles`
**URL Examples:**

- `http://localhost:3000/users/by-roles?roles=admin` (single value)
- `http://localhost:3000/users/by-roles?roles=admin&roles=user` (multiple values)
- `http://localhost:3000/users/by-roles?roles[]=admin&roles[]=user` (array notation)

```typescript
@Get('by-roles')
getUsersByRoles(@Query('roles') roles: string | string[]) {
  // roles can be a string or array of strings
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return {
    roles: roleArray,
    count: roleArray.length,
  };
}
```

### 6. Query Parameter Validation and Transformation

**Endpoint:** `GET /users/active`
**URL Examples:**

- `http://localhost:3000/users/active?isActive=true&minAge=18&maxAge=65`
- `http://localhost:3000/users/active?isActive=false`
- `http://localhost:3000/users/active` (uses defaults)

```typescript
@Get('active')
getActiveUsers(
  @Query('isActive') isActive: string = 'true',
  @Query('minAge') minAge?: string,
  @Query('maxAge') maxAge?: string,
) {
  // Convert string to boolean
  const active = isActive.toLowerCase() === 'true';

  // Convert strings to numbers with validation
  const minAgeNum = minAge ? parseInt(minAge) : undefined;
  const maxAgeNum = maxAge ? parseInt(maxAge) : undefined;

  return {
    filters: {
      isActive: active,
      minAge: minAgeNum,
      maxAge: maxAgeNum,
    },
    validFilters: {
      hasMinAge: !isNaN(minAgeNum!),
      hasMaxAge: !isNaN(maxAgeNum!),
    },
  };
}
```

## Testing the Examples

Start your NestJS application and test these endpoints:

```bash
npm run start:dev
```

Then use a tool like Postman, curl, or your browser to test:

1. **Basic pagination:** `http://localhost:3000/users?page=1&limit=5`
2. **Search:** `http://localhost:3000/users/search?q=john`
3. **Pagination with sorting:** `http://localhost:3000/users/paginated?page=2&sortBy=name&order=desc`
4. **Multiple filters:** `http://localhost:3000/users/filter?name=john&age=25&status=active`
5. **Multiple roles:** `http://localhost:3000/users/by-roles?roles=admin&roles=user`
6. **Active users filter:** `http://localhost:3000/users/active?isActive=true&minAge=18`

## Key Points to Remember

1. **Query parameters are always strings** - even numbers come as strings and need to be converted
2. **Use `@Query('paramName')` for specific parameters**
3. **Use `@Query()` without parameter name to get all query parameters**
4. **Provide default values** when parameters are optional
5. **Handle arrays** when the same parameter can appear multiple times
6. **Validate and transform** query parameters as needed
7. **Query parameters are optional by default** - they can be undefined

## Common Patterns

### Pagination

```typescript
@Get()
findAll(
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
) {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  // Use skip and take for database queries
}
```

### Filtering

```typescript
@Get()
findAll(@Query() filters: any) {
  // Remove empty/undefined values
  const cleanFilters = Object.entries(filters)
    .filter(([key, value]) => value !== undefined && value !== '')
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}
```

### Search

```typescript
@Get('search')
search(@Query('q') query?: string) {
  if (!query || query.trim() === '') {
    return { message: 'Please provide a search query' };
  }
  // Perform search
}
```
