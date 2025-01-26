# How to generate migration

```bash
npm run migration:generate .\src\migrations\<migration-name>
```

# Naming suggestions

### Initialize entity

```
Create<table-name>Table;
```

e.g. `CreateUsersTable`

<br/>

### Update entity (>1 change)

```
Update<table-name>Table
```

e.g. `UpdateUsersTable`

<br/>

### Update entity's property (1 change)

```
Update<property-name>PropertyIn<entity-name>Entity
```

e.g. `UpdatePasswordPropertyInUserEntity`

<br/>

### Expand entity with new property

```
Expand<entity-name>EntityWith<property-name>Property
```

e.g. `ExpandUserEntityWithPasswordProperty`

<br/>

### Remove property from entity

```
Remove<property-name>PropertyFrom<entity-name>Entity
```

e.g. `RemovePasswordPropertyFromUserEntity`
