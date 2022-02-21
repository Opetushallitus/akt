package fi.oph.akt.util;

import java.util.Optional;
import lombok.Builder;
import lombok.NonNull;

public record Localisation(Optional<String> fi, Optional<String> sv, Optional<String> en) {
  // Workaround for bug in IntelliJ lombok plugin
  // https://github.com/mplushnikov/lombok-intellij-plugin/issues/764
  @Builder
  public Localisation {}
}
