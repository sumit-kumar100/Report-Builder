# Searlizing MongoDB Data Into Json
def serializeDict(a) -> dict:
    return {**{i: str(a[i]) for i in a if i == '_id'}, **{i: a[i] for i in a if i != '_id'}}

# Searlizing MongoDB Data List Into Json
def serializeList(entity) -> list:
    return [serializeDict(a) for a in entity]