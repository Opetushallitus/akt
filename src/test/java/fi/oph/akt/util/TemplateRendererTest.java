package fi.oph.akt.util;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test-hsql")
class TemplateRendererTest {

  @Resource
  private TemplateRenderer templateRenderer;

  @Test
  public void testContactRequestClerkTemplateIsRendered() {
    final String renderedContent = templateRenderer.renderContactRequestClerkEmailBody(
      Map.of(
        "translators",
        List.of(Map.of("id", "1", "name", "Jack Smith", "phone", "+358 400 888 666")),
        "requesterName",
        "John Doe",
        "requesterEmail",
        "john.doe@unknown.invalid",
        "requesterPhone",
        "+358 400 888 777"
      )
    );

    assertNotNull(renderedContent);
    assertTrue(renderedContent.contains("<html "));
    assertTrue(renderedContent.contains("1"));
    assertTrue(renderedContent.contains("Jack Smith"));
    assertTrue(renderedContent.contains("+358 400 888 666"));
    assertTrue(renderedContent.contains("John Doe"));
    assertTrue(renderedContent.contains("john.doe@unknown.invalid"));
    assertTrue(renderedContent.contains("+358 400 888 777"));
  }

  @Test
  public void testContactRequestRequesterTemplateIsRendered() {
    final String renderedContent = templateRenderer.renderContactRequestRequesterEmailBody(
      Map.of(
        "contactedTranslators",
        List.of("Jack Smith", "Mark Davis"),
        "otherTranslators",
        List.of("James Moore"),
        "requesterName",
        "John Doe",
        "requesterEmail",
        "john.doe@unknown.invalid",
        "requesterPhone",
        "+358 400 888 777",
        "messageLines",
        "This is the message."
      )
    );

    assertNotNull(renderedContent);
    assertTrue(renderedContent.contains("<html "));
    assertTrue(renderedContent.contains("Jack Smith"));
    assertTrue(renderedContent.contains("Mark Davis"));
    assertTrue(renderedContent.contains("James Moore"));
    assertTrue(renderedContent.contains("John Doe"));
    assertTrue(renderedContent.contains("john.doe@unknown.invalid"));
    assertTrue(renderedContent.contains("+358 400 888 777"));
    assertTrue(renderedContent.contains("This is the message."));
  }

  @Test
  public void testContactRequestTranslatorTemplateIsRendered() {
    final String renderedContent = templateRenderer.renderContactRequestTranslatorEmailBody(
      Map.of(
        "requesterName",
        "John Doe",
        "requesterEmail",
        "john.doe@unknown.invalid",
        "requesterPhone",
        "+358 400 888 777",
        "messageLines",
        "This is the message."
      )
    );

    assertNotNull(renderedContent);
    assertTrue(renderedContent.contains("<html "));
    assertTrue(renderedContent.contains("John Doe"));
    assertTrue(renderedContent.contains("john.doe@unknown.invalid"));
    assertTrue(renderedContent.contains("+358 400 888 777"));
    assertTrue(renderedContent.contains("This is the message."));
  }
}
