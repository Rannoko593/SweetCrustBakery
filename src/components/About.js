const About = () => {
  return (
    <div className="about-section">
      <h2 className="text-center mb-4"><i className="fas fa-info-circle me-2"></i>About Sweet Crust Bakery</h2>
      <div className="container">
        {/* Hero Section with Bakery Image */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="hero-bakery-image text-center">
              <img 
                src="/images/interior.jpg" 
                className="img-fluid rounded shadow" 
                alt="Sweet Crust Bakery Interior in Maseru, Lesotho" 
                style={{maxHeight: '400px', width: '100%', objectFit: 'cover'}}
              />
              <div className="hero-text mt-3">
                <p className="lead fst-italic text-muted">
                  "Hoja feela e 'ngoe le e 'ngoe e bolela pale ea setso le thoriso"
                </p>
                <p className="text-muted">"Where every bite tells a story of tradition and passion"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <p className="lead text-center">
              Sweet Crust Bakery, e patiloe ka hare ha Maseru, Lesotho, e ne e thabisetsa bareki lihlahisoa tsa bo-artsianal ho tloha ka 2020.
              Mesebetsi ea rona ke ho tlisa thabo ka lihlahisoa tse hloekileng, tse pshatloang tse nchafetseng tse entsoeng ka lerato le lisebelisoa tse ntle tsa lehae.
            </p>
            <p className="text-center">
              Located in the heart of Lesotho's capital, we bring authentic Basotho baking traditions with a modern twist to your table every day.
            </p>
          </div>
        </div>

        {/* Enhanced Cards Section with Lesotho Focus */}
        <div className="row mb-4">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src="/images/bakery-storefront.jpg" className="card-img-top" alt="Sweet Crust Bakery in Maseru Mall" style={{height: '200px', objectFit: 'cover'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title"><i className="fas fa-store me-2"></i>Maseru Location</h5>
                <p className="card-text flex-grow-1">Visit our flagship bakery at Maseru Mall, where the aroma of fresh bread and traditional Basotho treats welcomes you.</p>
                <small className="text-muted"><i className="fas fa-clock me-1"></i>Maobane - Labohlano: 7AM-7PM</small>
                <small className="text-muted"><i className="fas fa-map-marker-alt me-1"></i>Maseru Mall, Kingsway</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src="/images/goods.jpg" className="card-img-top" alt="Traditional Lesotho Baked Goods" style={{height: '200px', objectFit: 'cover'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title"><i className="fas fa-bread-slice me-2"></i>Local Specialties</h5>
                <p className="card-text flex-grow-1">From traditional Basotho bread to modern pastries infused with local flavors like moroho and indigenous grains.</p>
                <small className="text-muted"><i className="fas fa-seedling me-1"></i>Made with local maize and wheat</small>
                <small className="text-muted"><i className="fas fa-heart me-1"></i>Supporting Lesotho farmers</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src="/images/team.jpg" className="card-img-top" alt="Our Basotho Baking Team" style={{height: '200px', objectFit: 'cover'}} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title"><i className="fas fa-users me-2"></i>Basotho Bakers</h5>
                <p className="card-text flex-grow-1">Our team of passionate Basotho bakers combines generations of traditional knowledge with modern baking techniques.</p>
                <small className="text-muted"><i className="fas fa-award me-1"></i>Local culinary experts</small>
                <small className="text-muted"><i className="fas fa-graduation-cap me-1"></i>Trained in Lesotho & abroad</small>
              </div>
            </div>
          </div>
        </div>

        {/* Lesotho Community Impact */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h4><i className="fas fa-hands-helping me-2 text-primary"></i>Supporting Lesotho's Economy</h4>
                <div className="row mt-3">
                  <div className="col-md-3">
                    <h5 className="text-success">50+</h5>
                    <p>Local Farmers Supported</p>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-success">100%</h5>
                    <p>Local Workforce</p>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-success">15</h5>
                    <p>Communities Served</p>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-success">5</h5>
                    <p>Local Suppliers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials from Lesotho Residents */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="text-center mb-4"><i className="fas fa-comments me-2"></i>Lipale tse Monate ho tsoa ho Bareki ba Rona</h3>
            <h5 className="text-center mb-4 text-muted">Sweet Stories from Our Customers</h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card testimonial-card">
                  <div className="card-body">
                    <p className="fst-italic">"Lipasta tsa bona ke tse molemo ka ho fetisisa Maseru! Ke qala motsheare o ohle ka lihlahisoa tsa bona tse monate le kofi."</p>
                    <footer className="blockquote-footer mt-2">— Tumisang M., <cite title="Source Title">Mokhanni oa Kamele, Maseru</cite></footer>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card testimonial-card">
                  <div className="card-body">
                    <p className="fst-italic">"Likekhe tsa bona tse ikhethelang li makatsa! E entse letsatsi la matsoalo a morali oa le lona le sa lebaleheng ka likekhe e monate."</p>
                    <footer className="blockquote-footer mt-2">— Masekhoko S., <cite title="Source Title">Motsamaisi, Roma</cite></footer>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card testimonial-card">
                  <div className="card-body">
                    <p className="fst-italic">"As a tourist from South Africa, discovering Sweet Crust Bakery was a highlight of my Lesotho trip. The fusion of local flavors in their pastries is incredible!"</p>
                    <footer className="blockquote-footer mt-2">— Sarah van der M., <cite title="Source Title">Tourist from Cape Town</cite></footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h3 className="text-center mb-3">Pale ea Rona</h3>
            <h5 className="text-center mb-3 text-muted">Our Story</h5>
            <p>
              E thehiloe ka 2020, Sweet Crust Bakery e hlotsoe ho lerato la ho ba traditional baking le ponahatso ea ho theha setsi sa sechaba Maseru. 
              Re ikhethela ho bo-artsianal breads, likekhe, le lipasta, re sebedisa liresipi tsa mehleng ea khale le lisebelisoa tsa lehae.
            </p>
            <p>
              Tšepo ea rona ho boleng le tšireletso e re entse karolo e ratiloeng ea seemo sa Lesotho sa culinary. 
              Re sebedisa lisebelisoa tsa lehae tse kang poone ea Lesotho, leveste, le meroho ea Basotho ho etsa lihlahisoa tsa rona tse ikhethelang.
            </p>

            <h3 className="text-center mb-3">Mehopolo ea Rona</h3>
            <h5 className="text-center mb-3 text-muted">Our Values</h5>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="fas fa-check-circle me-2 text-success"></i><strong>Boleng:</strong> Ho sebedisa lisebelisoa tse ntle feela tsa Lesotho bakeng sa pontšo e sa tšoaneng le bo nchafo.</li>
                  <li className="mb-2"><i className="fas fa-check-circle me-2 text-success"></i><strong>Sechaba:</strong> Ho tšehetsa balimi le likhoebo tsa lehae ho tloha letsatsing la pele.</li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="fas fa-check-circle me-2 text-success"></i><strong>Thoriso:</strong> Ho ba ka lerato le tlhokomelo ho e 'ngoe le e 'ngoe ea ho latsoa.</li>
                  <li className="mb-2"><i className="fas fa-check-circle me-2 text-success"></i><strong>Setso:</strong> Ho boloka liresipi tsa 'nete ha ho eketsa litšobotsi tsa mehleng ea kajeno.</li>
                </ul>
              </div>
            </div>

            {/* Lesotho Cultural Connection */}
            <div className="card mt-4 bg-warning bg-opacity-10">
              <div className="card-body text-center">
                <h5><i className="fas fa-mountain me-2"></i>Proudly Basotho</h5>
                <p className="mb-0">
                  As the "Kingdom in the Sky," we incorporate the rich culinary heritage of Lesotho into every product we bake. 
                  From traditional bread recipes passed down through generations to modern interpretations of Basotho cuisine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;