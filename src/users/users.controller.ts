import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    console.log('Query parameters received:');
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('Search:', search);

    return this.usersService.findAll();
  }

  // Example 1: Reading single query parameter
  @Get('search')
  searchUsers(@Query('q') searchQuery: string) {
    console.log('Search query:', searchQuery);
    return {
      message: `Searching for users with query: ${searchQuery}`,
      query: searchQuery,
    };
  }

  // Example 2: Reading multiple query parameters with default values
  @Get('paginated')
  getPaginatedUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: string = 'asc',
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    return {
      message: 'Paginated users',
      pagination: {
        page: pageNum,
        limit: limitNum,
        sortBy,
        order,
      },
      data: `Users from ${(pageNum - 1) * limitNum + 1} to ${pageNum * limitNum}`,
    };
  }

  // Example 3: Reading all query parameters as an object
  @Get('filter')
  filterUsers(@Query() queryParams: Record<string, string>) {
    console.log('All query parameters:', queryParams);

    return {
      message: 'Filtered users',
      filters: queryParams,
      appliedFilters: Object.keys(queryParams).length,
    };
  }

  // Example 4: Reading array query parameters
  @Get('by-roles')
  getUsersByRoles(@Query('roles') roles: string | string[]) {
    console.log('Roles query:', roles);

    // Handle both single string and array of strings
    const roleArray = Array.isArray(roles) ? roles : [roles];

    return {
      message: 'Users filtered by roles',
      roles: roleArray,
      count: roleArray.length,
    };
  }

  // Example 5: Query parameter validation and transformation
  @Get('active')
  getActiveUsers(
    @Query('isActive') isActive: string = 'true',
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
  ) {
    const active = isActive.toLowerCase() === 'true';
    const minAgeNum = minAge ? parseInt(minAge) : undefined;
    const maxAgeNum = maxAge ? parseInt(maxAge) : undefined;

    return {
      message: 'Active users with age filter',
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
