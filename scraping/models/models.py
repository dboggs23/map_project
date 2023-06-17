import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, MetaData, Table
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.types import Date, Float
from dotenv import load_dotenv
import urllib.parse

load_dotenv()

dbname=os.environ.get("POSTGRES_DB")
user=os.environ.get("POSTGRES_USER")
password=urllib.parse.quote_plus(os.environ.get("POSTGRES_PW"))
host=os.environ.get("POSTGRES_HOST")
port=os.environ.get("POSTGRES_PORT")
print(os.environ.get("POSTGRES_DB"))

connectionString = f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}'

Base = declarative_base()

engine = create_engine(connectionString)
conn = engine.connect()
metadata = MetaData()


class Property(Base):
    __tablename__ = "property"

    id = Column(Integer, primary_key=True)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zipcode = Column(Integer)
    beds = Column(Integer)
    baths = Column(Float)
    location = Column(String)
    squareFootage = Column(Integer)
    lotSize = Column(Integer)
    yearBuilt = Column(Integer)
    # status - NO PRE MARKET
    url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    prices = relationship('PropertyEvent', backref='prices', lazy='dynamic')

class PropertyEvent(Base):
     __tablename__ = "property_events"

     id = Column(Integer, primary_key=True)
     propertyId = Column(Integer, ForeignKey('property.id'))
     date = Column(Date)
     price = Column(Integer)
     status = Column(String)
     
if __name__ == "__main__":
     True
     # run this or something similar to create tables:
     #Base.metadata.create_all(engine)
